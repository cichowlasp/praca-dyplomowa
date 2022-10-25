import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';

const MainFrom = () => {
	const [first, setfirst] = useState(null);
	useEffect(() => {
		fetch('api/getform')
			.then((response) => response.json())
			.then((data) => setfirst(data));
		console.log(first);
	}, []);
	return <div>MainFrom {first ? first.inputs[0].id : ''}</div>;
};

export default MainFrom;
