<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\EmailType;

class CollectType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', null, array('required'=>true, "label"=>"Nom et Prénom"))
                ->add('email',EmailType::class,array('required'=>true, 'label'=>"Adresse e-mail"))
            ->add('mobile',null,array('required'=>true, 'label'=>"Téléphone"))
            ->add('adress',null,array('required'=>true, 'label'=>"Adresse"))
            ->add('format',ChoiceType::class,array('required'=>true, 'label'=>"Format de calendrier",'choices'=>array('Calendrier mural format 31x46cm'=>"Calendrier mural format 31x46cm",
                "Calendrier de bureau format 21x10cm"=>"Calendrier de bureau format 21x10cm"
                )))
            ->add('message',null,array('required'=>true, 'label'=>"Dates importantes",
                /*'sonata_help' => 'Set the title of a web page'*/))
        ;
    }/**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'csrf_protection'   => false,
            'data_class' => 'AppBundle\Entity\Collect'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_collect';
    }


}
