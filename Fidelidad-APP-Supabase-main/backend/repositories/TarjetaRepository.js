class TarjetaRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async findAllWithCliente() {
    const { data, error } = await this.db
      .from('tarjetas_fidelidad')
      .select(`
        id,
        cliente_id,
        nivel,
        puntos,
        fecha_envio,
        clientes (
          nombre,
          email
        )
      `)
      .order('fecha_envio', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await this.db
      .from('tarjetas_fidelidad')
      .select(`
        id,
        cliente_id,
        nivel,
        puntos,
        fecha_envio,
        clientes (
          nombre,
          email
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByClienteId(clienteId) {
    const { data, error } = await this.db
      .from('tarjetas_fidelidad')
      .select('id, cliente_id, nivel, puntos, fecha_envio')
      .eq('cliente_id', clienteId)
      .order('fecha_envio', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(tarjeta) {
    const { data, error } = await this.db
      .from('tarjetas_fidelidad')
      .insert([tarjeta])
      .select('id, cliente_id, nivel, puntos, fecha_envio')
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = TarjetaRepository;
