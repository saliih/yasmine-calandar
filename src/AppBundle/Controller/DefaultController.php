<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Collect;
use AppBundle\Form\CollectType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\HttpFoundation\Tests\JsonResponseTest;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $collect = new Collect();
        $form = $this->createForm(new CollectType(), $collect);
        if ($request->getMethod() == 'POST') {

            $form->submit($request->request->get($form->getName()));
            $files = $request->request->get('files');
            $serviceMailer = $this->get('app_sendmail');
            $allfiles = explode(',', $files);
            $collect->setFiles($allfiles);
            foreach ($allfiles as $file) {
                $serviceMailer->setAttachedfile($this->get('kernel')->getRootDir() . '/../web' . $file);
            }
            $serviceMailer->addTo("commercial@yasminepress.com");
            $serviceMailer->addBcc("salah.chtioui@gmail.com");
            $serviceMailer->setSubject("calandar commande");
            $serviceMailer->setBody($this->renderView('AppBundle:default:email.html.twig', array(
                "collect" => $collect,

            )));
            $serviceMailer->sendMail();
            $em->persist($collect);
            $em->flush();
            return new JsonResponse(array('success' => true));
        }
        return $this->render('AppBundle:default:index.html.twig', array(
            "form" => $form->createView()
        ));
    }

    /**
     * @Route("/extra", name="extra")
     */
    public function extraAction(Request $request)
    {
        return $this->render('AppBundle:default:extra.html.twig', array());
    }

    /**
     * @Route("/uploadimages/", name="upload_files")
     */
    public function uploadImagesAction(Request $request)
    {
        $tab = array();
        $diskPath = $this->container->getParameter('kernel.root_dir') . "/../web/uploads/";
        $time = time();
        $fs = new Filesystem();
        /** @var UploadedFile $file */

        foreach ($request->files->get('file') as $key => $file) {
            $path = $diskPath . $time;
            $fs->mkdir($path, 0777);
            $filename = rand(500, 5486) . ".jpg";
            if ($file->getExtension() == "pdf") {
                $filename = rand(500, 5486) . ".pdf";
            }

            $file->move($path, $filename);
            $tab[] = "/calendar/web/uploads/$time/" . $filename;
        }
        return new JsonResponse(array('id' => $time, "files" => $tab));
    }
}
