import './index.css'

const Project = props => {
  const {data} = props

  const {name, imageUrl} = data

  return (
    <li className="li">
      <img src={imageUrl} alt={name} className="list_img" />
      <p className="name">{name}</p>
    </li>
  )
}

export default Project
