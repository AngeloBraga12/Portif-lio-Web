# Portfólio Web

Um portfólio pessoal responsivo, construído com HTML, CSS e JavaScript puros. O projeto não requer etapa de compilação nem dependências externas para funcionar.

## Recursos

- Layout responsivo para desktop e dispositivos móveis.
- Navegação suave entre as seções.
- Alternância de tema claro/escuro, persistida no navegador.
- Filtro de projetos por categoria.
- Formulário de contato com validação no navegador e acesso rápido ao e-mail.
- Estrutura semântica e foco em acessibilidade.

## Como executar

1. Clone o repositório.
2. Abra o arquivo `index.html` diretamente no navegador, ou sirva a pasta com um servidor estático:

   ```bash
   python3 -m http.server 8000
   ```

3. Acesse `http://localhost:8000`.

## Estrutura

```text
.
├── index.html       # Estrutura e conteúdo da página
├── styles.css       # Tema, layout e responsividade
├── script.js        # Interações e validação do formulário
└── README.md
```

## Personalização

Substitua o nome, descrição, links e e-mail em `index.html` pelos seus dados. Para adicionar projetos, duplique um elemento `.project-card` e ajuste os atributos `data-category` e o conteúdo.

## Licença

Este projeto está disponível sob a licença MIT.
