# Serviço de Gerenciamento de Medidas de Água e Gás

Este projeto é um serviço backend desenvolvido em Node.js com NestJS para gerenciar a leitura individualizada de consumo de água e gás. Utiliza Inteligência Artificial (IA) para obter a medição através de fotos de medidores.

## Configuração e Execução

O serviço roda em um contêiner Docker. Para garantir o funcionamento, verifique se o Docker está instalado e configurado corretamente.

### Passos para Executar o Serviço

1. **Clone o Repositório:**
    Para começar, clone o repositório do projeto e entre no diretório do projeto:
    ```bash
    git clone <URL do repositório>
    cd <nome do diretório>
    ```

2. **Construa e Inicie o Contêiner:**
    Construa e inicie o contêiner Docker com o comando:
    ```bash
    docker-compose up
    ```

3. **Acesse o Serviço:**
    O serviço ficará disponível em `localhost:80`

### Configuração

Certifique-se de que ao menos um dos seguintes arquivos de configuração esteja presente na raiz do projeto e que a variável `GEMINI_API_KEY=<chave da API>` esteja configurada:

- `.env`
- `arquivo.env` 

## Execução de Testes
Para rodar os testes Jest, utilizar o comando `npm run test` dentro do contêiner Docker.

### Passos para Rodar os Testes

1. **Inicie o Contêiner:**
	Certifique-se de que o contêiner está em execução. Se ainda não estiver em execução, inicie-o com:

	```bash
	docker-compose up
	```

2. **Acesse o Contêiner**
	Entre no contêiner onde o serviço está rodando usando o comando:

	```bash
	docker-compose exec backend sh
	```

3. **Execute os Testes**
	Dentro do contêiner, execute o comando para rodar os testes:

	```bash
	npm run test
	```

## Endpoints

### 1. `POST /upload`

**Descrição:**  
Responsável por receber uma imagem em Base64, consultar a API Gemini e retornar a medida lida pela API.

**Request Body:**
```json
{ 
	"image": "base64", 
	"customer_code": "string", 
	"measure_datetime": "datetime", 
	"measure_type": "WATER" ou "GAS"
} 
```

**Response Body:**
```json
{ 
	"image_url": "string", 
	"measure_value": 123, 
	"measure_uuid": "string" 
}
```

### 2. `PATCH /confirm`

**Descrição:**  
Responsável por confirmar ou corrigir o valor lido pela IA.

**Request Body:**
```json
{
	"measure_uuid": "string",
	"confirmed_value": 123
}
```

**Response Body:**
```json
{ 
	"success": true 
}
```

### 3. `GET /<customer_code>/list`

**Descrição:**  
Responsável por listar as medidas realizadas por um determinado cliente. Pode receber um parâmetro de consulta opcional measure_type para filtrar por tipo de medição.

**Request Parameters:**
- `customer_code` (Path parameter): Código do cliente.
- `measure_type` (Query parameter, opcional): Tipo de medição (água, gás, etc.).


**Response Body:**
```json
{ 
	"customer_code": "string", 
	"measures": [ 
		{ 
			"measure_uuid": "string", 
			"measure_datetime": "datetime", 
			"measure_type": "string", 
			"has_confirmed": true, 
			"image_url": "string"
		}
	] 
}
```

