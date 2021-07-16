import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
    if (request.method === 'POST') {
        const TOKEN = 'c2b1bd2f7c7883189c8467ba35bed1';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "968791",
            ...request.body,
            // title: "Comunidade de Teste",
            // imageurl: "http://m.leiaja.com/sites/default/files/field/image/lazer/2018/ramon_0.jpg",
            // url: "http://m.leiaja.com/sites/default/files/field/image/lazer/2018/ramon_0.jpg",
            // creatorSlug: "Acir-Moreira"
        })

        response.json({
            dados: "algum dado qualquer",
            registroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        message: 'Ocorreu um erro, acesse via POST!'
    })
}