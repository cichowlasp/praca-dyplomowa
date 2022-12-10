import { Company, User, Order, Info, Message } from '@prisma/client';
import React, { useState } from 'react';
import OrderCard from './OrderCard';

const OrderWithCompany = ({
	company,
	filters,
	updateData,
}: {
	company: Company & {
		users: (User & {
			orders: (Order & {
				informations: Info[];
				messages: Message[];
			})[];
		})[];
	};
	filters: {
		search: (
			o: Order & { informations: Info[]; messages: Message[] }
		) => boolean;
		option: (
			o: Order & { informations: Info[]; messages: Message[] }
		) => boolean;
	};
	updateData: () => {};
}) => {
	const [showTitle, setShowTitle] = useState<boolean>(true);

	let orders: (Order & {
		informations: Info[];
		messages: Message[];
	})[] = [];
	company.users.forEach((user) => {
		orders = [...orders, ...user.orders];
	});
	return (
		<div key={company.id} style={{ width: '20rem' }}>
			<h1 style={{ margin: 0, display: showTitle ? 'block' : 'none' }}>
				{company.companyName}
			</h1>
			{company.users.length === 0 || orders.length === 0 ? (
				<div
					style={{
						width: '20rem',
						opacity: '0.7',
						fontWeight: 'bold',
					}}>
					No matching results :c
				</div>
			) : null}
			{company.users?.map((user) => {
				return (
					<div key={user.id}>
						{user.orders
							?.sort((a, b) => {
								if (a.creationData > b.creationData) {
									return -1;
								}
								if (a.creationData < b.creationData) {
									return 1;
								}
								return 0;
							})
							?.filter(filters.search)
							?.filter(filters.option)
							?.map((order, index) => (
								<OrderCard
									key={order.id}
									order={order}
									index={index}
									admin={true}
									user={user}
									updateData={updateData}
								/>
							))}
					</div>
				);
			})}
		</div>
	);
};

export default OrderWithCompany;
