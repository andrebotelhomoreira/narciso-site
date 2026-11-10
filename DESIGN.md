# Narciso — Direção de design e identidade do site

> Documento de contexto de design. Deve orientar futuras páginas e alterações sem substituir dados verificáveis da operação.

## Propósito

Narciso Material de Construção: loja física no Vale Encantado, Vila Velha, ES. O site apresenta categorias de materiais de obra e reforma e transforma interesse em consultas por WhatsApp. Público: moradores, profissionais e responsáveis por reformas que buscam materiais e esclarecimentos antes de se deslocar.

## Direção visual: arquitetura editorial de bairro

O visual da Narciso deve parecer sólido, profissional e próximo: superfícies claras, composição arquitetônica, fotografia real de produtos, textos legíveis e CTAs diretos. Nunca parecer um marketplace genérico nem uma loja de luxo desconectada do setor de construção.

A assinatura visual se apoia no **N de tijolos** da logomarca, em linhas de projeto e no contraste controlado entre azul profundo e laranja.

### Tokens da marca

- **Azul Narciso** `#000062`: primário e blocos institucionais.
- **Azul profundo** `#050642`: hero, orçamento, rodapé e contraste.
- **Laranja da marca** `#F26B1D`: CTAs, links e linhas de destaque; evitar painéis extensos de cor laranja.
- **Branco** `#FFFFFF`: superfícies de leitura e formulários.
- **Cinza técnico claro** `#F2F3F7`: fundo de seções e respiro.
- **Tinta escura** `#11172D`: texto sobre superfícies claras.

A fonte de títulos é **Barlow Condensed**, com caixa alta quando apropriado. A fonte de corpo e controles é **IBM Plex Sans**. Não adicionar novas famílias web sem necessidade mensurada.

### Composição

- Cabeçalho de navegação estável, com logo original e orçamento visível.
- Home com manchete de alta personalidade à esquerda e foto real à direita.
- Faixa de benefícios em fundo neutro, com ícones e informações comprovadas.
- Categorias apresentadas com fotos de produtos reais, tamanho generoso e respiro editorial.
- Blocos explicativos com linhas discretas e hierarquia clara; usar laranja como guia, não decoração indiscriminada.
- Formulário de orçamento com destaque por borda superior laranja, leitura rápida e WhatsApp como ação principal.
- Rodapé azul profundo com dados de contato e links úteis.
- Animações discretas; respeitar preferência de movimento reduzido.

### Comportamento / produção

- **Mobile-first:** texto e imagens sem cortes de informação importante; menus e botões tocáveis; CTA fixo na base somente quando não encobrir conteúdo.
- **Acessibilidade:** teclado e foco visível, contraste adequado, rótulos nos campos, sem navegação apenas por hover.
- **Performance:** priorizar HTML/CSS/JS nativos; reutilizar imagens WebP existentes, manter `width`/`height`, `loading="lazy"` em mídia fora da dobra; evitar novas bibliotecas e fontes desnecessárias.
- **Tema claro e escuro:** respeitar tokens sem modificar imagem e logo originais.
- **SEO:** preservar URL, title, metas, heading H1, dados estruturados, canonical e sitemap. Alteração visual não deve causar mudanças inadvertidas de SEO.
- **Comércio real:** não inventar preços, estoque, entrega, avaliações, frete, horário ou categorias sem confirmação. Preferir "consultar disponibilidade" a alegações vagas.
- **WhatsApp:** +55 27 99925-9494. Preservar links e instrumentos de medição já existentes.
- **Marca:** nunca redesenhar o logo N sem pedido explícito.

## Implementação

- Origem dos tokens e do design compartilhado: `assets/site.css` (seção `NARCISO DESIGN SYSTEM — EVOLUÇÃO PREMIUM 2026`).
- Páginas locais e editoriais possuem CSS complementar próprio. Não reimplementar cabeçalho, tipografia e botões em cada uma.
- Projeto estático publicado a partir da branch `main` do repositório `andrebotelhomoreira/narciso-site` pelo Netlify.
- Domínio oficial: `https://narcisomaterial.com.br/`.

## Lista de verificação para próximas mudanças

1. Conferir branch/commit atuais e estilos globais.
2. Preservar logo, conteúdo editorial e SEO existente.
3. Verificar desktop e mobile (320, 375, 768, 1024, 1440 px), menu, formulários, contraste, foco e tema escuro.
4. Confirmar CSS, imagens e JS do site inteiro após deploy; evitar substituir a árvore do GitHub por apenas arquivos modificados.
5. Conferir o commit publicado e status pronto no Netlify; não declarar inspeção visual se não houve.
