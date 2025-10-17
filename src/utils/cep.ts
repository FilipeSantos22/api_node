import https from 'https';

export function buscarEnderecoPorCep(cep: string): Promise<any> {
    const cepEnviado = (cep || '').replace(/[^0-9]/g, '');
    return new Promise((resolve, reject) => {
        if (!cepEnviado || cepEnviado.length !== 8) {
            return reject(new Error('CEP inválido'));
        }

        const url = `https://viacep.com.br/ws/${cepEnviado}/json/`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.erro) {
                        return reject(new Error('CEP não encontrado'));
                    }
                    resolve({
                        rua: parsed.logradouro || null,
                        bairro: parsed.bairro || null,
                        cidade: parsed.localidade || null,
                        estado: parsed.uf || null,
                        cep: parsed.cep || cepEnviado
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => reject(err));
    });
}
