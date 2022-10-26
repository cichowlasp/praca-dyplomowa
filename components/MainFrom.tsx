import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';

const MainFrom = () => {
	const [first, setfirst] = useState(undefined);
	useEffect(() => {
		fetch('api/getform')
			.then((response) => response.json())
			.then((data) => setfirst(data));
	}, []);
	return (
		<div>
			<h1>Fill up to take order</h1>
			{first ? (
				first.inputs.map((el) => (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						key={el.id}>
						<TextField
							placeholder={el.placeholder}
							type={el.type}
						/>
					</div>
				))
			) : (
				<></>
			)}
		</div>
	);
};

export default MainFrom;
