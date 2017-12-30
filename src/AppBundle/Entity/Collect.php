<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Collect
 *
 * @ORM\Table(name="collect")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CollectRepository")
 */
class Collect
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;
    /**
     * @var string
     *
     * @ORM\Column(name="message", type="text", nullable=true)
     */
    private $message;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=255)
     */
    private $email;
    /**
     * @var string
     *
     * @ORM\Column(name="dcr", type="datetime")
     */
    private $dcr;
    /**
     * @var boolean
     *
     * @ORM\Column(name="act", type="boolean")
     */
    private $act;

    /**
     * @var string
     *
     * @ORM\Column(name="adress", type="string", length=255)
     */
    private $adress;

    /**
     * @var string
     *
     * @ORM\Column(name="mobile", type="string", length=255)
     */
    private $mobile;
    /**
     * @var string
     *
     * @ORM\Column(name="files", type="array", nullable=true)
     */
    private $files;

    public function __construct()
    {
        $this->dcr = new \DateTime();
        $this->act = true;
    }

    /**
     * @return string
     */
    public function getDcr()
    {
        return $this->dcr;
    }

    /**
     * @param string $dcr
     */
    public function setDcr($dcr)
    {
        $this->dcr = $dcr;
    }


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Collect
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return Collect
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set adress
     *
     * @param string $adress
     *
     * @return Collect
     */
    public function setAdress($adress)
    {
        $this->adress = $adress;

        return $this;
    }

    /**
     * Get adress
     *
     * @return string
     */
    public function getAdress()
    {
        return $this->adress;
    }

    /**
     * Set mobile
     *
     * @param string $mobile
     *
     * @return Collect
     */
    public function setMobile($mobile)
    {
        $this->mobile = $mobile;

        return $this;
    }

    /**
     * Get mobile
     *
     * @return string
     */
    public function getMobile()
    {
        return $this->mobile;
    }

    /**
     * @return string
     */
    public function getFiles()
    {
        return $this->files;
    }

    /**
     * @param string $files
     */
    public function setFiles($files)
    {
        $this->files = $files;
    }

    /**
     * @return bool
     */
    public function isAct()
    {
        return $this->act;
    }

    /**
     * @param bool $act
     */
    public function setAct($act)
    {
        $this->act = $act;
    }

    /**
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param string $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }
}

