'use strict';

const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaBodyParser = require('koa-bodyparser');

const koa = new Koa();

koa.use(KoaBodyParser());

koa.use((ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
  } else {
    next();
  }
  ctx.set({
    'Access-Control-Allow-Methods': ctx.headers['access-control-request-method'],
    'Access-Control-Allow-Headers': ctx.headers['access-control-request-headers'],
    'Access-Control-Allow-Origin': ctx.headers['origin'],
    'Access-Control-Allow-Credentials': true
  });
});

const router = new KoaRouter();

let inc = 1;
const fakeData = [
  { id: inc++, name: '半壶纱', desc: '半壶纱', opts: [ 'A', 'C' ], level: 'A', radio: 'A' },
  { id: inc++, name: '一路上有你', desc: '一路上有你', opts: [ 'A', 'D' ], level: 'A', radio: 'C' },
  { id: inc++, name: '独角戏', desc: '独角戏', opts: [ 'C', 'D' ], level: 'C', radio: 'A' },
  { id: inc++, name: '大梦想家', desc: '大梦想家', opts: [ 'B', 'D' ], level: 'D', radio: 'D' },
  { id: inc++, name: '甜蜜蜜', desc: '甜蜜蜜', opts: [ 'A', 'B' ], level: 'B', radio: 'B' }
];

router.get('/list', (ctx, next) => {
  ctx.body = fakeData;
});

router.post('/list', (ctx, next) => {
  let data = ctx.request.body;
  data.id = inc++;
  fakeData.push(data);
  ctx.body = {};
});

router.get('/list/:id', (ctx, next) => {
  let id = +ctx.params.id;
  for (let item of fakeData) if (item.id === id) {
    item = Object.assign({}, item);
    delete item.id;
    ctx.body = item;
  }
});

router.delete('/list/:id', (ctx, next) => {
  let id = +ctx.params.id;
  for (let i = 0; i < fakeData.length; i++) if (fakeData[i].id === id) {
    fakeData.splice(i, 1);
    ctx.body = {};
  }
});

router.put('/list/:id', (ctx, next) => {
  let id = +ctx.params.id;
  let data = ctx.request.body;
  for (let item of fakeData) if (item.id === id) {
    for (let i in item) if (i !== 'id') item[i] = data[i];
    ctx.body = {};
  }
});

router.post('/list/:id/hx', (ctx, next) => {
  let id = +ctx.params.id;
  for (let item of fakeData) if (item.id === id) {
    item.name = '已和谐';
    ctx.body = {};
  }
});

koa.use(router.routes());

koa.listen(1234);
