# Pages CMS — Narciso Material de Construção

## Acesso ao painel

1. Abra https://app.pagescms.org.
2. Entre usando o GitHub que possui acesso ao repositório **andrebotelhomoreira/narciso-site**.
3. Autorize/instale o aplicativo do Pages CMS e libere **somente esse repositório**, quando a opção estiver disponível.
4. Selecione a branch **main** e a coleção **Artigos novos do blog**.
5. Abra o rascunho de exemplo ou crie um novo artigo.

**O Pages CMS é externo ao site da Narciso.** Não há senha nova armazenada no repositório ou área /admin no site público.

## Como criar e publicar um artigo

- **Título visível:** H1 da página.
- **Slug:** somente letras minúsculas sem acentos, números e hífens (ex.: `como-escolher-tinta-em-vila-velha`). Define `/blog/slug/`. Não mude o slug de artigos publicados sem planejar 301.
- **Publicar no site:** deixe desmarcado enquanto estiver escrevendo. Só `published = true` gera uma página.
- **Data:** informe uma data válida AAAA-MM-DD.
- **Meta title:** título da aba e do Google. Recomendado até 60–65 caracteres.
- **Meta description:** resumo descritivo para mecanismos de busca (aprox. 140–160 caracteres).
- **Resumo:** aparece no cartão do blog.
- **Categoria editorial:** organização do conteúdo.
- **Capa:** escolha imagem real e apropriada; ideal WebP otimizada (boa compressão) com texto alternativo descritivo.
- **Conteúdo:** editor visual/Markdown, com títulos H2/H3, listas, negrito, links e imagens. Um H1 já é gerado automaticamente; não coloque outro no corpo.

Ao salvar, o Pages CMS grava JSON no GitHub. O Netlify executa `node scripts/build-blog.mjs`, publica a página estática e atualiza automaticamente a listagem `/blog/` e `/sitemap.xml`. O deploy precisa terminar com estado **ready**.

### Cuidados de SEO

Não inventar preços, estoque, frete, horários, avaliações, áreas atendidas ou benefícios. A sede da loja fica na **Rua Barra Nova, 195, Vale Encantado, Vila Velha/ES**. Para consultas, usar o WhatsApp oficial **(27) 99925-9494**. Usar fontes externas verificáveis para notícias ou dados imobiliários; citar no texto.

## Escopo desta primeira integração

- ✅ Criar e publicar **novos artigos** a partir do painel.
- ✅ Imagens de capa e inseridas no texto.
- ✅ SEO automático: title, description, canonical, Open Graph, BlogPosting, BreadcrumbList e sitemap.
- ✅ Link para artigos na página índice do blog.
- ✅ Rascunhos invisíveis ao público (o build não copia a pasta `content/`).
- ✅ Preservar artigos existentes e todas as URLs já indexadas.
- ⏳ Artigos antigos, páginas de categoria e homepage continuam sendo editados no código por enquanto. Migrá-los requer adaptar conteúdos sem perder estrutura e tráfego orgânico.
- ⏳ Conectar o aplicativo Pages CMS à conta GitHub exige autorização do titular. O repositório não pode fazê-la automaticamente.

## Arquivos

- `.pages.yml`: esquema dos campos.
- `content/artigos/*.json`: fonte editorial (incluindo rascunhos).
- `assets/uploads/`: imagens enviadas pelo CMS.
- `scripts/build-blog.mjs`: gerador estático sem dependências.
- `netlify.toml`: build `node scripts/build-blog.mjs`, saída `dist`.

## Segurança operacional e testes

- `dist/` é gerado pelo Netlify; não editar nem commitar.
- O gerador falha se houver slug inválido, imagem inexistente, artigo duplicando uma URL já ocupada, SEO obrigatório ausente ou HTML de referência removido.
- Em caso de erro no build, Netlify deve manter a última publicação funcional. Corrija o artigo antes de tentar novamente.
- Teste periódico: conferir Home, /blog/, artigos anteriores, /materiais/tintas/, CSS e scripts compartilhados, sitemap e botões do WhatsApp.
- O CMS publica por commits no GitHub; use o histórico para reverter alterações.
