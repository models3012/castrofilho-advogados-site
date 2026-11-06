# Site — Castro Filho Advogados Associados

Site estático (HTML, CSS e JavaScript puros, sem build) que substitui o site atual no Wix.
O conteúdo é idêntico ao do site original. O texto de referência está em [CONTEUDO.md](CONTEUDO.md).

## Organização

```
castrofilho-advogados/
├── index.html                 Página principal (todas as seções)
├── blog/                      Lista de artigos e uma pasta por artigo
├── post/                      Redirecionamentos dos endereços antigos do Wix (/post/...)
├── mapa/                      Redirecionamento do antigo /mapa → /#contato
├── 404.html                   Página "não encontrada"
├── assets/
│   ├── css/styles.css         Estilos de todo o site
│   ├── js/main.js             Menu, currículos, mapa, formulário
│   ├── img/                   Imagens otimizadas (WebP), logos e ícones
│   └── docs/                  Apresentação institucional (PDF)
├── favicon.ico, favicon.png, site.webmanifest
├── robots.txt, sitemap.xml
├── CONTEUDO.md                Textos de referência extraídos do site antigo
└── _originais/                Imagens originais em alta (não precisam ir para o ar)
```

## Ver o site no computador

Na pasta do projeto, rode:

```bash
python -m http.server 8080
```

Depois abra http://localhost:8080 no navegador.

## Publicar no GitHub Pages com o domínio próprio

O site já está publicado no repositório https://github.com/models3012/castrofilho-advogados-site
(GitHub Pages ativo na branch `main`, pasta raiz). Qualquer `git push` na branch `main` atualiza o site em cerca de um minuto.

**Prévia:** por enquanto o domínio próprio foi retirado do GitHub Pages, para o site poder ser visto em
https://models3012.github.io/castrofilho-advogados-site/ antes da troca do DNS.

**Para colocar no domínio próprio:** primeiro altere o DNS (tabela abaixo). Depois, em **Settings → Pages → Custom domain**,
informe `www.castrofilhoadvogados.com.br` e salve (o GitHub recria o arquivo `CNAME`). A partir daí, o endereço de prévia
redireciona para o domínio.

Falta só apontar o domínio. O DNS do domínio é administrado hoje **pelo Wix** (servidores `ns8.wixdns.net` e `ns9.wixdns.net`).
No Wix, abra **Domínios → (o domínio) → Registros DNS** e altere:

| Tipo  | Nome (host)                  | Valor                   |
|-------|------------------------------|-------------------------|
| CNAME | `www`                        | `models3012.github.io`  |
| A     | `@` (castrofilhoadvogados.com.br) | `185.199.108.153` |
| A     | `@`                          | `185.199.109.153`       |
| A     | `@`                          | `185.199.110.153`       |
| A     | `@`                          | `185.199.111.153`       |

Apague os registros A antigos do domínio raiz que apontam para o Wix (`185.230.63.x`).

> **Não mexa nos registros MX.** O e-mail `contato@castrofilhoadvogados.com.br` é atendido pela GoDaddy
> (`smtp.secureserver.net` e `mailstore1.secureserver.net`). Se trocar os servidores DNS do domínio ou cancelar
> o Wix, recrie esses registros MX no novo provedor antes, senão o e-mail para de funcionar.

Depois que o DNS propagar (de minutos a algumas horas), abra **Settings → Pages** no repositório e marque **Enforce HTTPS**
assim que o certificado estiver pronto.

Os redirecionamentos (`/post/...`, `/mapa`) e a página 404 usam caminhos a partir da raiz do domínio. Por isso, funcionam corretamente no domínio próprio, mas não em um endereço do tipo `usuario.github.io/repositorio`.

## Formulário de contato

Por padrão, o botão **Enviar mensagem** abre o aplicativo de e-mail do visitante com a mensagem já preenchida para `contato@castrofilhoadvogados.com.br`.

Para receber as mensagens direto no e-mail, sem depender do aplicativo do visitante:

1. Crie um formulário gratuito em https://formspree.io usando o e-mail do escritório.
2. Copie a URL do formulário (algo como `https://formspree.io/f/abcdwxyz`).
3. Em `assets/js/main.js`, cole essa URL em `CONFIG.formEndpoint`.

## WhatsApp

O número fica em `CONFIG.whatsapp` no arquivo `assets/js/main.js`, e também nos links `https://wa.me/556234138125` em `index.html` e nas páginas do blog. Se o número mudar, substitua `556234138125` em todos os arquivos com um "localizar e substituir".

## Pontos para o escritório confirmar

- **Nome do advogado:** o site antigo mostrava "Henrique **Fagunes**", mas o currículo e o nome da foto dizem "Henrique **Fagundes** Filho". O novo site usa **Henrique Fagundes**.
- **Currículo sem uso:** o site antigo tinha um pop-up com o currículo de **Jordanna Rodrigues di Araújo** (OAB/GO 25.467) que não aparecia em nenhum lugar da página. Ela não foi incluída. Se ela ainda faz parte da equipe, o currículo está em [CONTEUDO.md](CONTEUDO.md) e pode ser adicionado.
- **Ano de 2007 na trajetória do fundador:** a data vem da matéria do Conjur de 27/08/2007 ("Ministro Castro Filho, do STJ, se aposenta e vai abrir escritório"). Confirme o ano de fundação.
