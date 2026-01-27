<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */


use chums\ui\WebUI2;
use chums\user\Groups;
use chums\ui\JSOptions;
use chums\ui\CSSOptions;


require_once ("autoload.inc.php");

$ui = new WebUI2([
    'title' => 'Shopify Payouts',
    'bodyClassName' => 'container-fluid',
    'requiredRoles' => [Groups::CS, Groups::ACCOUNTING],
    'contentFile' => 'body.inc.php'
]);
$ui->addCSS('public/styles.css', CSSOptions::parse(['useTimestampVersion' => true]))
    ->addManifestJSON('public/js/manifest.json')
    ->render();
