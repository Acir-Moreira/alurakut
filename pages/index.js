import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((itemAtual) => {
          if (propriedades.title == 'Comunidades') {
            return (
              <li key={itemAtual.id}>
                <a href={itemAtual.url}>
                 <img src={itemAtual.image} />
                  <span>{itemAtual.title}</span>
                </a>
              </li>
            )
          } else {
            return (
              <li key={itemAtual.id}>
                <a href={`https://github.com/${itemAtual.login}`} >
                 <img src={itemAtual.avatar_url} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            )
                
              }})}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const githubUser = 'Acir-Moreira';

  const [comunidades, setComunidades] = React.useState([{
    id: '12341864651456432',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
    url: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);

  //const pessoasFavoritas = ['juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobrunodev', 'felipefialho', 'Gabriel-025', 'jessicacosta07', 'drimmorais']
  const [pessoasFavoritas, setPessoasFavoritas] = React.useState([]);
  React.useEffect(function() {
    fetch('https://api.github.com/users/acir-moreira/following')
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setPessoasFavoritas(respostaCompleta);
    })
  }, [])

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function() {
    fetch('https://api.github.com/users/acir-moreira/followers')
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    })
  }, [])

  const { SiteClient } = require('datocms-client');
  const client = new SiteClient('c2b1bd2f7c7883189c8467ba35bed1');

  return (
    <>
      <AlurakutMenu />
      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>

          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);              

              const comunidade = {
                id: new Date().toISOString,
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
                url: dadosDoForm.get('url')
              }

              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
            }}>
              <div>
                <input placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?" 
                type="text"
                />
              </div>
              <div>
                <input placeholder="Coloque uma URL (imagem) para utilizar de capa" 
                name="image" 
                aria-label="Coloque uma URL para utilizar de capa?" 
                />
              </div>

              <div>
                <input placeholder="Link para a sua comunidade" 
                name="url" 
                aria-label="Link para a sua comunidade?" 
                />
              </div>

              <button>
                Criar Comunidade
              </button>

            </form>
          </Box>

        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          
          <ProfileRelationsBox title="Pessoas da Comunidade" items={pessoasFavoritas} />
          <ProfileRelationsBox title="Comunidades" items={comunidades} />
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          
        </div>
      </MainGrid>
    </>
  )
}
