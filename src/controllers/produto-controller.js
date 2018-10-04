'use strict';

/* jshint ignore:start */

const repository = require('../repositories/produto-repository');
const ValidationContract = require('../validators/validator');
const azure = require('azure-storage');
const config = require('../config');
const guid = require('guid');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data);
    } catch(e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        });
    }
}

exports.getById = async(req, res, next) => {
    try{
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch(e){
        res.status(400).send({
            message: 'Falha ao processar sua requisição!'
        });
    }
}

exports.post = async(req, res, next) => {

    let contract = new ValidationContract();
    
    contract.hasMinLen(req.body.description,3,'A descrição deve conter pelo menos 3 caracteres!');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try{

        // Cria o Blob Service
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + ".jpg";
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        // Salva a imagem
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type,
        }, function (error, result, response) {
                if(error) {
                    filename = 'default-product.jpg'
                }
        });

        await repository.post({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: filename,
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch(e){
        console.log(e)
        res.status(400).send({
            message: 'Falha ao cadastrar o produto!'
        });
    }
};

exports.put = async(req, res, next) => {
    try{
        await repository.put(req.params.id, req.body);
        res.status(201).send({
            message: 'Customer atualizado com sucesso!'
        });
    } catch(e){
        res.status(400).send({
            message: 'Falha ao atualizar customer!'
        });
    }
}

exports.delete = async(req, res, next) => {
    try{
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Customer removido com sucesso!'
        });
    } catch(e){
        res.status(400).send({
            message: 'Falha ao remover customer!'
        });
    }
};

/* jshint ignore:end */