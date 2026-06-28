class UserRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async findByCredentials(username, password) {
    const { data, error } = await this.db
      .from('usuarios')
      .select('id, username')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}

module.exports = UserRepository;
