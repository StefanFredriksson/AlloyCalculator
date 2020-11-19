import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Test () {
  const [name] = useState(useParams().name)
  useEffect(() => {
    getAlloy()
  }, [])

  const getAlloy = () => {
    const link = 'https://localhost:5001/api/alloy?name=' + name
    window.fetch(link).then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log(data)
        })
      }
    })
  }
  return (
    <div>
      <h1>{useParams().name}</h1>
    </div>
  )
}
