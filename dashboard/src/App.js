import {
	Select,
	Form,
	DatePicker,
	Row,
	Col
} from 'antd';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

import './App.scss';

const App = () => {
	const [hotels, setHotels] = useState([]);
	const [selectedHotel, setSelectedHotel] = useState();
	const [dates, setDates] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [form] = Form.useForm();

  	/*eslint-disable */
	useEffect(() => {
		axios.get('/api/hotel')
			.then(response => {
				const hotelData = response.data;
				if (hotelData.length) {
					setHotels(hotelData);
					setSelectedHotel(hotelData[0].id);
				}
			})
	}, [])

	useEffect(() => {
		if (selectedHotel) {
			form.resetFields(['hotel']);
			let reviewUrl = `api/review/findByFilter?hotelId=${selectedHotel}`;
			if (dates.length === 2) {
				const [startDate, endDate] = dates;
				const startDateParam = startDate.format('YYYY-MM-DD');
				const endDateParam = endDate.format('YYYY-MM-DD');
				reviewUrl = `${reviewUrl}&fromDate=${startDateParam}&toDate=${endDateParam}`;
			}
			axios.get(reviewUrl)
			.then(response => {
				const reviewData = response.data;
				if (reviewData.length) {
					setReviews(reviewData);
				}
			})
		}
	}, [selectedHotel, dates])
	/*eslint-enable */

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const { reviewCount, averageScore } = payload[0].payload;
			return (
				<div className="tts__tooltip">
					<p>Score: {averageScore}</p>
					<p>Review Count: {reviewCount}</p>
				</div>
			);
		}
	  
		return null;
	};

	return (
		<div className="tts">
			<div className="tts__header">
				<Form
					form={form}
					initialValues={{
						hotel: selectedHotel
					}}
				>
					<h4>Filter</h4>
					<Row gutter={16}>
						<Col xs={24} sm={12}>
							<Form.Item
								name="hotel"
								label="Select hotel"
							>
								<Select
									options={hotels.map(h => ({
										value: h.id,
										label: h.name
									}))}
									onChange={(value) => setSelectedHotel(value)}
								>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								name="date"
								label="From - To"
							>
								<DatePicker.RangePicker
									style={{width: '100%'}}
								onChange={selectedDates => {
									console.log(selectedDates);
									setDates(selectedDates)
								}} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
			<div className="tts__chart">
				<h1>Average Score</h1>
				<h4>Score</h4>
				<ResponsiveContainer>
					<LineChart data={reviews} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
						<Line type="monotone" dataKey="averageScore" stroke="#8884d8" />
						<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
						<XAxis dataKey="dateGroup" />
						<YAxis />
						<Tooltip content={<CustomTooltip />} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
};

export default App;