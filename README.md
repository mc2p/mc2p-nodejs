# MyChoice2Pay NodeJS


# Overview

MyChoice2Pay NodeJS provides integration access to the MyChoice2Pay API.

[![Build Status](https://travis-ci.org/mc2p/mc2p-nodejs.svg?branch=master)](https://travis-ci.org/mc2p/mc2p-nodejs)

# Installation

You can install using `npm`:

    npm install --save mc2p-nodejs

# Code Support
- EcmaScript 5, EcmaScript 6,  EcmaScript 8, TypeScript, async-await, Promises, Callback !
- JSON response.
- All methods support Promise and Callback both.


# Quick Start Example

    var mc2p = require('mc2p')('KEY', 'SECRET_KEY');

    # Create transaction
    mc2p.transaction.create({
        currency: "EUR",
        products: [{
            amount: 1,
            product_id: "PRODUCT-ID"
        }]
    }, function (error, transaction) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('transaction', transaction);
        transaction.pay_url; # Send user to this url to pay
        transaction.iframe_url; # Use this url to show an iframe in your site
        transaction.token; # Token of transaction
    });
    # or with product details
    mc2p.transaction.create({
        currency: "EUR",
        products: [{
            amount: 1,
            product: {
                name: "Product",
                price: 5
            }
        }]
    }, function (error, transaction) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('transaction', transaction);
        transaction.pay_url; # Send user to this url to pay
        transaction.iframe_url; # Use this url to show an iframe in your site
        transaction.token; # Token of transaction
    });

    # Get plans
    mc2p.plan.list(function (error, planPaginator) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('planList', planPaginator);
        planPaginator.result; # Application's plans
        planPaginator.count; # Count of plans
        planPaginator.next; # Next page url
    });

    # Get product, change and save
    mc2p.product.get("PRODUCT-ID", function (error, product) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('product', product);
    });
    mc2p.product.change("PRODUCT-ID", {
        price: 10
    }, function (error, product) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('product', product);
    });

    # Create and delete tax
    mc2p.tax.create({
        "name": "Tax",
        "percent": 5
    }, function (error, tax) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('tax', tax);
    });
    mc2p.tax.delete("TAX-ID", function (error, tax) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('tax', tax);
    });

    # Receive a notification
    event = mc2p.notification.constructEvent(
      request.rawBody # JSON_REQUEST_RECEIVED_FROM_MYCHOICE2PAY
    );
    event.status;
    event.type;
