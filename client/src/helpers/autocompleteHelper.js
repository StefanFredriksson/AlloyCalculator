export const autocomplete = (input, data) => {
  const auto = document.querySelector('#autocomplete')

  auto.addEventListener('mousedown', event => {
    event.preventDefault()
    input.value = event.target.textContent
    populate(data, event.target.textContent)
    document.querySelector('.next-input').focus()
  })

  input.addEventListener('focus', e => {
    auto.style.display = 'flex'
    populate(data, e.target.value)
  })

  input.addEventListener('focusout', e => {
    auto.style.display = 'none'
  })

  input.addEventListener('keydown', e => {
    if (e.keyCode === 40) {
      const focus = auto.querySelector('.current-focus')
      const divs = auto.querySelectorAll('.autocomplete-item')

      if (!focus) {
        divs[0].classList.add('current-focus')
      } else {
        for (let i = 0; i < divs.length; i++) {
          if (divs[i] === focus) {
            if (i === divs.length - 1) {
              divs[0].classList.add('current-focus')
            } else {
              divs[i + 1].classList.add('current-focus')
            }
            focus.classList.remove('current-focus')
          }
        }
      }
    } else if (e.keyCode === 38) {
      const focus = auto.querySelector('.current-focus')
      const divs = auto.querySelectorAll('.autocomplete-item')

      if (!focus) {
        divs[divs.length - 1].classList.add('current-focus')
      } else {
        for (let i = 0; i < divs.length; i++) {
          if (divs[i] === focus) {
            if (i === 0) {
              divs[divs.length - 1].classList.add('current-focus')
            } else {
              divs[i - 1].classList.add('current-focus')
            }
            focus.classList.remove('current-focus')
          }
        }
      }
    } else if (e.keyCode === 13) {
      e.preventDefault()
      const focus = auto.querySelector('.current-focus')

      if (focus) {
        e.target.value = focus.innerHTML
        populate(data, focus.innerHTML)
      }
    }
  })

  input.addEventListener('input', e => {
    populate(data, e.target.value)
  })
}

const populate = (arr, val) => {
  const auto = document.querySelector('#autocomplete')
  auto.innerHTML = ''

  const mapped = arr.filter(a => {
    const s = a.substr(0, val.length)
    return s.toUpperCase() === val.toUpperCase() && a.length !== val.length
  })

  mapped.sort((a, b) => {
    return a.length - b.length
  })

  for (const m of mapped) {
    const div = document.createElement('div')
    div.setAttribute('class', 'autocomplete-item')
    div.innerHTML = m
    auto.appendChild(div)
  }
}
