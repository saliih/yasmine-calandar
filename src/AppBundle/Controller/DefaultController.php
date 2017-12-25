<?php

namespace AppBundle\Controller;

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
        return $this->render('AppBundle:default:index.html.twig', array());
    }

    /**
     * @Route("/uploadimages/", name="upload_files")
     */
    public function uploadImagesAction(Request $request){
        $tab = array();
        $diskPath = $this->container->getParameter('kernel.root_dir') . "/../web/uploads/";
        $time = time();
        $fs = new Filesystem();
        /** @var UploadedFile $file */
        foreach ($request->files->get('file') as $file){
            $path = $diskPath.$time;
            $fs->mkdir($path, 0777);
              $file->move($path, $file );
              $tab[] = "/web/uploads/".$file->getClientOriginalName();
        }
        return new JsonResponse($tab);
    }
}
