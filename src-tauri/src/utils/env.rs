use std::env;

/// Função auxiliar para tentar obter uma variável de ambiente e convertê-la para bool.
pub fn var_bool(var_name: &str) -> bool {
  match env::var(var_name) {
      Ok(val) => matches!(val.to_lowercase().as_str(), "true" | "yes" | "1"),
      Err(_) => false, // Retorna false ou um valor padrão se a variável não estiver definida
  }
}