import { GithubUser } from './GithubUser.js'

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-fav:')) || []
  }

  save() {
    localStorage.setItem('@github-fav:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)
      if (userExists) {
        throw new Error('Usuário já favoritado!')
      }
      const user = await GithubUser.search(username)
      console.log(user)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login,
    )

    this.entries = filteredEntries
    this.update()
    this.save()
    window.location.reload()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    if (this.entries.length === 0) {
      const row = this.emptyTable()
      this.tbody.append(row)
    } else {
      this.removeAllTr()
    }

    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector(
        '.user img',
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}.png`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if (isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
  }

  emptyTable() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="empty-row">
      <img src="./assets/star404.svg" alt="imagem de uma estrela " />
    </td>
    <td class="advisor" colspan="3">
      Nenhum favorito ainda
    </td>
    `
    return tr
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img
          src="https://github.com/wagnerleodoro.png"
          alt="Imagem de wagnerleodoro"
        />
        <a href="https://github.com/wagnerleodoro" target="_blank">
          <p>Wagner Leodoro</p>
          <span>wagnerleodoro</span>
        </a>
      </td>
      <td class="repositories">76</td>
      <td class="followers">9589</td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}
