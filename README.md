Resolução do Desafio 8 da Maratona [Behind the Code 2020](https://www.maratona.dev/pt) da IBM

Descrição do desafio: https://github.com/maratonadev-br/desafio-8-2020

API desenvolvida em Node.js e Typescript

No diretório [NLU](NLU/) tem o export dos Types criados e também do dicionário usado para a pré anotação.

Esta API foi publicada no IBM Cloud Foundry, configure o manifest.yaml de acordo com seu uso. Pelo menos o nome da aplicação deve ser alterado para um valor único.

O script [push.sh](push.sh) faz o build da aplicação e atualiza o código na nuvem.

As informações de API KEY e URL do NLU e STT ficam configuradas no .env, conforme o exemplo neste repositório.
