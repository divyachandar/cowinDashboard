// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    coWinData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCoWinData()
  }

  getCoWinData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const apiUrl = `https://apis.ccbp.in/covid-vaccination-data`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok === true) {
      const convertData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        coWinData: convertData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Something went wrong</h1>
    </div>
  )

  renderCowinPiView = () => {
    const {coWinData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = coWinData
    return (
      <>
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
        <VaccinationByGender vaccinationByGenderData={vaccinationByGender} />
        <VaccinationCoverage last7DaysVaccinationData={last7DaysVaccination} />
      </>
    )
  }

  renderCowinDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCowinPiView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p>co-WIN</p>
        </div>
        <h1>Co-WIN vaccinaation in India</h1>
        <div>{this.renderCowinDetails()}</div>
      </div>
    )
  }
}
export default CowinDashboard
