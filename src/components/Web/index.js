import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import Project from '../Project'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Web extends Component {
  state = {
    type: categoriesList[0].id,
    data: [],
    status: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  onTap = event => {
    this.setState({type: event.target.value})
  }

  getData = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const {type} = this.state

    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${type}`,
    )
    if (response.ok) {
      const jsonData = await response.json()
      const UpdateData = jsonData.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState(
        {data: UpdateData, status: apiStatusConstants.success},
        this.getData,
      )
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  make = (id, displayText) => (
    <option value={id} className="option">
      {displayText}
    </option>
  )

  Tasks = () => {
    const {data} = this.state
    return (
      <ul className="ul">
        {data.map(each => (
          <Project key={each.id} data={each} />
        ))}
      </ul>
    )
  }

  onPress = () => {
    this.getData()
  }

  getElements = () => {
    const {status} = this.state
    switch (status) {
      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.success:
        return this.Tasks()

      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="btn" onClick={this.onPress}>
        Retry
      </button>
    </div>
  )

  render() {
    const {type} = this.state
    return (
      <>
        <Header />
        <div className="bg">
          <select className="select" value={type} onChange={this.onTap}>
            {categoriesList.map(each => this.make(each.id, each.displayText))}
          </select>
          {this.getElements()}
        </div>
      </>
    )
  }
}

export default Web
