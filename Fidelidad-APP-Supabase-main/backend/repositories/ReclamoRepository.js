class ReclamoRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async findAllWithReward() {
    const { data, error } = await this.db
      .from('reclamos_recompensa')
      .select(`
        id,
        cliente_id,
        recompensa_id,
        fecha,
        recompensas (
          nombre,
          tipo,
          nivel
        )
      `)
      .order('fecha', { ascending: false })
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(reclamo) {
    const { data, error } = await this.db
      .from('reclamos_recompensa')
      .insert([reclamo])
      .select('id, cliente_id, recompensa_id, fecha, mes, anio')
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = ReclamoRepository;
