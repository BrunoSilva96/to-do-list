const express = require('express');

const router = express.Router();

const Checklist = require('../models/checklist');

router.get('/', async (req, res) => {//Ler todas as coisas
   try {
      let checklists = await Checklist.find({});
      res.status(200).render('checklists/index', { checklists: checklists});
   } catch (error) {
      res.status(200).render('pages/error', {error: 'Erro ao exibir as Listas'});

   }
})

router.get('/new', async(req, res) => {
   try {
      let checklist = new Checklist();
      res.status(200).render('checklists/new', { checklist: checklist});
   } catch (error) {
      res.status(500).render('pages/error', { error: 'Erro ao carregar o formulário'})
   }
})

router.get('/:id/edit', async (req, res) => {
   try {
      let checklist = await Checklist.findById(req.params.id);
      res.status(200).render('checklists/edit', {checklist: checklist});
   } catch (error) {
      res.status(500).render('pages/error', { error: 'Erro ao exibir a edição de Lista de tarefas'})
   }
})

router.post('/', async (req, res) => {
   let { name } = req.body.checklist;
   let checklist = new Checklist({name})

   try{
      await checklist.save();
      res.redirect('/checklist');
   } catch (error) {
      res.status(422).render('/checklist/new', { checklist: {...checklist, error}});   
   }
});


router.get('/:id', async (req, res) => {//Ler coisas especificas
   try {
      let checklist = await Checklist.findById(req.params.id).populate('tasks');
      res.status(200).render('checklists/show', { checklist: checklist});
   } catch (error) {
      res.status(500).render('pages/error', {error: 'Erro ao exibir as Listas de tarefas'});
   }
})

router.put('/:id', async (req, res) => { //Atualizar Dados
   let { name } = req.body.checklist
   let checklist = await Checklist.findById(req.params.id);

   try{
      await checklist.update({name});
      res.redirect('/checklist')
   } catch (error) {
      let errors = error.errors;
      res.status(422).render('checkists/edit', {checklist: {...checklist, errors}})
   }
})

router.delete('/:id', async (req, res) => {//Deletar Dados
   try{
      let checklist = await Checklist.findByIdAndRemove(req.params.id);
      res.redirect('/checklist');
   } catch (error) {
      res.status(500).render('pages/error', {error: 'Erro ao deletar a Lista de tarefa'});
   }
})


module.exports = router;


//sudo mongod --dbpath /var/lib/mongodb/ --journal    (PARA ABRIR O MONGO CASO NÃO ABRA COM COMANDO => MONGO)