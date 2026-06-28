class ClienteRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async findAll() {
    const { data, error } = await this.db
      .from('clientes')
      .select('id, nombre, email')
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await this.db
      .from('clientes')
      .select('id, nombre, email')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByEmail(email) {
    const { data, error } = await this.db
      .from('clientes')
      .select('id, nombre, email')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findDuplicatedEmail(email, exceptId = null) {
    let query = this.db
      .from('clientes')
      .select('id')
      .eq('email', email);

    if (exceptId) {
      query = query.neq('id', exceptId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async create(cliente) {
    const { data, error } = await this.db
      .from('clientes')
      .insert([cliente])
      .select('id, nombre, email')
      .single();

    if (error) throw error;
    return data;
  }

  async update(id, cliente) {
    const { data, error } = await this.db
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select('id, nombre, email')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.db
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

module.exports = ClienteRepository;
