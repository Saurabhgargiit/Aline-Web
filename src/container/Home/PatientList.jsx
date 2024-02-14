import './PatientList.scss'
import { Badge } from 'react-bootstrap';
import SVG from "react-inlinesvg";

const obj = [
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   },
   {
      name: 'Saurabh Garg',
      date: '21-Aug-2023',
      status: 'Active',
      count: '15 out of 24',
      img: 'https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg'
   }
]


const PatientList = () => {

   const patientList = obj.map((el, i) => (
      <div className="row-container" key={i}>
         <div className='img-container'>
            <img src="https://d2rdbjk9w0dffy.cloudfront.net/assets/anonymous-user.jpeg"></img>
         </div>
         <div className='home-page-name-date mt-2'>
            <div className='home-page-name font700'>Saurabh Garg</div>
            <div className='home-page-date font14'>21-Aug-2023</div>
         </div>
         <div className='home-status mt-2'>
            <Badge pill bg="primary">
               Primary
            </Badge>
         </div>
         <div className='mt-2'>
            <div className='home-page-count'>15 out of 24</div>
            <div className="home-page-icons">
               <SVG src={require('../../assets/icons/deleteBin.svg').default} />
               <SVG src={require('../../assets/icons/edit.svg').default} />
               <SVG src={require('../../assets/icons/file.svg').default} />
               <SVG className='home-page-play' src={require('../../assets/icons/play.svg').default} />
            </div>
         </div>
      </div>

   ));
   console.log(patientList);

   return (
      <div className='patientList'>
         {patientList}
      </div>
   )
}

export default PatientList;