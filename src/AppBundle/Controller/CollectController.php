<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Collect;

class CollectController extends Controller
{
    /**
     * @Route("/collectlist", name="collect_list")
     */
    public function indexAction()
    {
        $collect = $this->getDoctrine()->getRepository('AppBundle:Collect')->findBy(array('act'=>true), array('dcr'=>"DESC"));
        return $this->render('@App/Collect/index.html.twig', array(
            'collects'=>$collect
        ));
    }
    /**
     * @Route("/collectlistcalider/{id}", name="collect_validate")
     */
    public function validateAction(Collect $collect)
    {
        $em = $this->getDoctrine()->getManager();
        $collect->setAct(false);
        $em->persist($collect);
        $em->flush();
        return $this->redirectToRoute('collect_list');
    }
}
