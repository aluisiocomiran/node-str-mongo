'use strict';

/* jshint ignore:start */

const repository = require('../repositories/customer-repository');
const ValidationContract = require('../validators/validator');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data);
    } catch(e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        })
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
    
    contract.hasMinLen(req.body.name,3,'O nome deve conter pelo menos 3 caracteres!');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try{
        await repository.post({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ["user"]
        });

        emailService.send(
            req.body.email, 
            'Bem vindo ao Node Store', 
            global.EMAIL_TMPL.replace('{0}',req.body.name))

        res.status(201).send({
            message: 'Customer cadastrado com sucesso!'
        });
    } catch(e){
        res.status(400).send({
            message: 'Falha ao cadastrar customer!'
        });
    }
};

exports.authenticate = async(req, res, next) => {
    try{
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });
        
        if(!customer){
            res.status(404).send({
                message: 'Usuário ou Senha inválidos!'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });
 
        res.status(201).send({
            token: token,
            data: {
                id: customer.id,
                email: customer.email,
                name: customer.name    
            }
        });
    } catch(e){
        res.status(400).send({
            message: 'Falha na autenticação do usuário!'
        });
    }
};

exports.refreshToken = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);   

        const customer = await repository.getById(data.id);
        
        if(!customer){
            res.status(404).send({
            message: 'Cliente não encontrado!'
        });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });
 
        res.status(201).send({
            token: token,
            data: {
                id: customer.id,
                email: customer.email,
                name: customer.name    
            }
        });
    } catch(e){
        res.status(400).send({
            message: 'Falha na autenticação do usuário!'
        });
    }
};

exports.put = async(req, res, next) => {
    try{
        await repository.put(req.params.id, req.body);
        res.status(201).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch(e){
        res.status(400).send({
            message: 'Falha ao atualizar produto!'
        });
    }
}

exports.delete = async(req, res, next) => {
    try{
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch(e){
        res.status(400).send({
            message: 'Falha ao remover produto!'
        });
    }

};
/* jshint ignore:end */