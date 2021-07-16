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
                  <img src={itemAtual.imageurl} />
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

          }
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const githubUser = 'Acir-Moreira';

  const [comunidades, setComunidades] = React.useState([

  ]);

  //const pessoasFavoritas = ['juunegreiros', 'omariosouto', 'peas', 'rafaballerini', 'marcobrunodev', 'felipefialho', 'Gabriel-025', 'jessicacosta07', 'drimmorais']
  const [pessoasFavoritas, setPessoasFavoritas] = React.useState([]);
  React.useEffect(function () {
    fetch('https://api.github.com/users/acir-moreira/following')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setPessoasFavoritas(respostaCompleta);
      })
  }, [])

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    fetch('https://api.github.com/users/acir-moreira/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })
  }, [])

  React.useEffect(function () {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '54aa02310069b5667f5bdaf9035e3a',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
      allCommunities {
        id
        title
        imageurl
        url
        creatorSlug
      }
    }`})
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato)
      })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
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
                title: dadosDoForm.get('title'),
                imageurl: dadosDoForm.get('image'),
                url: dadosDoForm.get('url'),
                creatorSlug: githubUser
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              })

              
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
