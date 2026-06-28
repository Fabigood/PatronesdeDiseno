class CompraRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async findAllOrdered() {
    const { data, error } = await this.db
      .from('compras')
      .select('id, cliente_id, fecha, monto, puntos_generados')
      .order('fecha', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async create(compra) {
    const { data, error } = await this.db
      .from('compras')
      .insert([compra])
      .select('id, cliente_id, fecha, monto, puntos_generados')
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = CompraRepository;
