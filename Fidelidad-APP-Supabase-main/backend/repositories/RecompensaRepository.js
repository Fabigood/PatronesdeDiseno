class RecompensaRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async findAll() {
    const { data, error } = await this.db
      .from('recompensas')
      .select('id, nombre, nivel, tipo, detalle, activo')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await this.db
      .from('recompensas')
      .select('id, nombre, nivel, tipo, detalle, activo')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(recompensa) {
    const { data, error } = await this.db
      .from('recompensas')
      .insert([recompensa])
      .select('id, nombre, nivel, tipo, detalle, activo')
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, recompensa) {
    const { data, error } = await this.db
      .from('recompensas')
      .update(recompensa)
      .eq('id', id)
      .select('id, nombre, nivel, tipo, detalle, activo')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.db
      .from('recompensas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

module.exports = RecompensaRepository;
