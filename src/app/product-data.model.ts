export interface ProductData {
    id?: number,
    cnpj: string,
    imagem_hash: string,
    status: string,
    data_emissao: string,
    valor_total: number,
    action?: string
}
