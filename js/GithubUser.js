export class GithubUser {
  static async search(username) {
    const url = `https://api.github.com/users/${username}`

    return fetch(url)
      .then((response) => response.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }))
  }
}
