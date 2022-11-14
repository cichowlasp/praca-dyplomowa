import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Select,
	MenuItem,
	TextField,
	Switch,
	useTheme,
	Button,
	Popover,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../styles/AdminForms.module.css';
import Loading from './Loading';
import AddIcon from '@mui/icons-material/Add';

const AdminForms = () => {
	const { palette } = useTheme();
	const { data: session, status } = useSession();
	const [loading, setLoading] = useState(false);
	const [forms, setForms] = useState<any[]>([]);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [addToFormPopUp, setAddToFormPopUp] =
		useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleFormClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAddToFormPopUp(event.currentTarget);
	};
	const handleFormClose = () => {
		setAddToFormPopUp(null);
	};

	const updateForm = async (id: string, index: number) => {
		setLoading(true);
		await fetch('/api/admin/updateform', {
			method: 'POST',
			body: JSON.stringify({ id, data: forms[index] }),
		});
		setLoading(false);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const openForm = Boolean(addToFormPopUp);
	const idForm = open ? 'popover-form' : undefined;

	useEffect(() => {
		setLoading(true);
		if (session?.user.admin) {
			fetch('/api/admin/getforms')
				.then((response) => response.json())
				.then((data) => setForms(data));
			setLoading(false);
		}
	}, [session?.user.admin, setLoading]);

	if (loading && !session?.user)
		return (
			<div>
				<Loading />
			</div>
		);
	return (
		<div>
			{forms.map((el, index) => {
				const numberOfOptions =
					el.inputs.length + el.selects.length + el.checkboxes.length;
				return (
					<Accordion key={index} elevation={3}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							{el?.id}
						</AccordionSummary>
						<AccordionDetails>
							{el.inputs.map((input: any, inputIndex: number) => {
								return (
									<div
										key={input.id}
										className={styles.inputEdit}
										style={{
											border: `2px solid ${palette.primary.main}`,
										}}>
										Input
										<div className={styles.options}>
											<div className={styles.option}>
												<div
													style={{
														fontWeight: 'bold',
														marginTop: 'auto',
													}}>
													Order
												</div>
												<div>
													<Select
														value={
															forms[index].inputs[
																inputIndex
															].order
														}
														size='small'
														onChange={(event) =>
															setForms((prev) => {
																let updatedList =
																	prev;
																updatedList[
																	index
																].inputs[
																	inputIndex
																].order =
																	event.target.value;
																return [
																	...updatedList,
																];
															})
														}>
														{Array.from(
															Array(
																numberOfOptions
															).keys()
														).map(
															(
																num: number,
																index: number
															) => (
																<MenuItem
																	key={index}
																	value={num}>
																	{num}
																</MenuItem>
															)
														)}
													</Select>
												</div>
											</div>
											<div className={styles.option}>
												<span
													style={{
														fontWeight: 'bold',
														marginTop: 'auto',
													}}>
													Label
												</span>
												<span>
													<TextField
														size='small'
														value={
															forms[index].inputs[
																inputIndex
															]?.label
														}
														onChange={(event) =>
															setForms((prev) => {
																let updatedList =
																	prev;
																updatedList[
																	index
																].inputs[
																	inputIndex
																].label =
																	event.target.value;
																return [
																	...updatedList,
																];
															})
														}
													/>
												</span>
											</div>
											<div className={styles.option}>
												<span
													style={{
														fontWeight: 'bold',
														marginTop: 'auto',
													}}>
													Placeholder
												</span>
												<span>
													<TextField
														size='small'
														value={
															forms[index].inputs[
																inputIndex
															]?.placeholder
														}
														onChange={(event) =>
															setForms((prev) => {
																let updatedList =
																	prev;
																updatedList[
																	index
																].inputs[
																	inputIndex
																].placeholder =
																	event.target.value;
																return [
																	...updatedList,
																];
															})
														}
													/>
												</span>
											</div>
											<div className={styles.option}>
												<span
													style={{
														fontWeight: 'bold',
														marginTop: 'auto',
													}}>
													Required
												</span>
												<span>
													<Switch
														checked={
															forms[index].inputs[
																inputIndex
															]?.required
														}
														onChange={() =>
															setForms((prev) => {
																let updatedList =
																	prev;
																updatedList[
																	index
																].inputs[
																	inputIndex
																].required =
																	!updatedList[
																		index
																	].inputs[
																		inputIndex
																	].required;
																return [
																	...updatedList,
																];
															})
														}
													/>
												</span>
											</div>
											<div className={styles.option}>
												<span
													style={{
														fontWeight: 'bold',
														marginTop: 'auto',
													}}>
													Type
												</span>
												<span>
													<Select
														value={
															forms[index].inputs[
																inputIndex
															].type
														}
														size='small'
														onChange={(event) =>
															setForms((prev) => {
																let updatedList =
																	prev;
																updatedList[
																	index
																].inputs[
																	inputIndex
																].type =
																	event.target.value;
																return [
																	...updatedList,
																];
															})
														}>
														{[
															'text',
															'email',
															'number',
															'password',
															'color',
														].map(
															(
																el: string,
																index: number
															) => (
																<MenuItem
																	key={el}
																	value={el}>
																	{el}
																</MenuItem>
															)
														)}
													</Select>
												</span>
											</div>
										</div>
									</div>
								);
							})}
							{el.selects.map(
								(select: any, selectIndex: number) => {
									return (
										<div
											key={select.id}
											className={styles.inputEdit}
											style={{
												border: `2px solid ${palette.primary.main}`,
											}}>
											Select
											<div className={styles.options}>
												<div className={styles.option}>
													<div
														style={{
															fontWeight: 'bold',
															marginTop: 'auto',
														}}>
														Order
													</div>
													<div>
														<Select
															value={
																forms[index]
																	.selects[
																	selectIndex
																].order
															}
															size='small'
															onChange={(event) =>
																setForms(
																	(prev) => {
																		let updatedList =
																			prev;
																		updatedList[
																			index
																		].inputs[
																			selectIndex
																		].order =
																			event.target.value;
																		return [
																			...updatedList,
																		];
																	}
																)
															}>
															{Array.from(
																Array(
																	numberOfOptions
																).keys()
															).map(
																(
																	num: number,
																	index: number
																) => (
																	<MenuItem
																		key={
																			index
																		}
																		value={
																			num
																		}>
																		{num}
																	</MenuItem>
																)
															)}
														</Select>
													</div>
												</div>
												<div className={styles.option}>
													<span
														style={{
															fontWeight: 'bold',
															marginTop: 'auto',
														}}>
														Label
													</span>
													<span>
														<TextField
															size='small'
															value={
																forms[index]
																	.selects[
																	selectIndex
																]?.label
															}
															onChange={(event) =>
																setForms(
																	(prev) => {
																		let updatedList =
																			prev;
																		updatedList[
																			index
																		].selects[
																			selectIndex
																		].label =
																			event.target.value;
																		return [
																			...updatedList,
																		];
																	}
																)
															}
														/>
													</span>
												</div>
												<div className={styles.option}>
													<span
														style={{
															fontWeight: 'bold',
															marginTop: 'auto',
														}}>
														Options
													</span>
													<span>
														<Button
															aria-describedby={
																id
															}
															variant='contained'
															onClick={
																handleClick
															}>
															Options
														</Button>
														<Popover
															id={id}
															open={open}
															anchorEl={anchorEl}
															onClose={
																handleClose
															}
															anchorOrigin={{
																vertical:
																	'bottom',
																horizontal:
																	'left',
															}}>
															<div
																style={{
																	display:
																		'flex',
																	flexDirection:
																		'column',
																	justifyContent:
																		'center',
																}}>
																{select.options.map(
																	(
																		inp: any,
																		inpIndex: number
																	) => {
																		return (
																			<div
																				key={
																					inp.id
																				}
																				style={{
																					padding:
																						'5px',
																				}}>
																				<TextField
																					size='small'
																					placeholder='option'
																					value={
																						forms[
																							index
																						]
																							.selects[
																							selectIndex
																						]
																							?.options[
																							inpIndex
																						]
																							.value
																					}
																					onChange={(
																						event
																					) =>
																						setForms(
																							(
																								prev
																							) => {
																								let updatedList =
																									prev;
																								updatedList[
																									index
																								].selects[
																									selectIndex
																								].options[
																									inpIndex
																								].value =
																									event.target.value;
																								return [
																									...updatedList,
																								];
																							}
																						)
																					}
																				/>
																				<Button
																					color='error'
																					variant='contained'
																					disabled={
																						loading
																					}
																					onClick={async () => {
																						let options;
																						setLoading(
																							true
																						);
																						await fetch(
																							'/api/admin/removeoption',
																							{
																								method: 'POST',
																								body: inp.id,
																							}
																						);

																						await fetch(
																							'/api/admin/getforms'
																						)
																							.then(
																								(
																									response
																								) =>
																									response.json()
																							)
																							.then(
																								(
																									data
																								) => {
																									console.log(
																										data
																									);
																									options =
																										data[
																											index
																										]
																											.selects[
																											selectIndex
																										]
																											.options;
																								}
																							);
																						setLoading(
																							false
																						);
																						setForms(
																							(
																								prev
																							) => {
																								let updatedList =
																									prev;
																								updatedList[
																									index
																								].selects[
																									selectIndex
																								].options =
																									updatedList[
																										index
																									].selects[
																										selectIndex
																									].options =
																										options;

																								return [
																									...updatedList,
																								];
																							}
																						);
																					}}>
																					<DeleteIcon />
																				</Button>
																			</div>
																		);
																	}
																)}
																<Button
																	disabled={
																		loading
																	}
																	variant='contained'
																	onClick={async () => {
																		setLoading(
																			true
																		);
																		await fetch(
																			'/api/admin/createoption',
																			{
																				method: 'POST',
																				body: JSON.stringify(
																					{
																						value: 'New Option',
																						selectId:
																							select.id,
																					}
																				),
																			}
																		);
																		let options =
																			forms[
																				index
																			]
																				.selects[
																				selectIndex
																			]
																				.options;
																		await fetch(
																			'/api/admin/getforms'
																		)
																			.then(
																				(
																					response
																				) =>
																					response.json()
																			)
																			.then(
																				(
																					data
																				) => {
																					console.log(
																						data
																					);
																					options.push(
																						data[
																							index
																						].selects[
																							selectIndex
																						].options.at(
																							-1
																						)
																					);
																				}
																			);
																		setLoading(
																			false
																		);

																		setForms(
																			(
																				prev
																			) => {
																				let updatedList =
																					prev;
																				updatedList[
																					index
																				].selects[
																					selectIndex
																				].options =
																					options;

																				return [
																					...updatedList,
																				];
																			}
																		);
																	}}>
																	Add Option
																</Button>
															</div>
														</Popover>
													</span>
												</div>
												<div className={styles.option}>
													<span
														style={{
															fontWeight: 'bold',
															marginTop: 'auto',
														}}>
														Required
													</span>
													<span>
														<Switch
															checked={
																forms[index]
																	.selects[
																	selectIndex
																]?.required
															}
															onChange={() =>
																setForms(
																	(prev) => {
																		let updatedList =
																			prev;
																		updatedList[
																			index
																		].selects[
																			selectIndex
																		].required =
																			!updatedList[
																				index
																			]
																				.selects[
																				selectIndex
																			]
																				.required;
																		return [
																			...updatedList,
																		];
																	}
																)
															}
														/>
													</span>
												</div>
											</div>
										</div>
									);
								}
							)}
							{el.checkboxes.map(
								(checkbox: any, checkboxIndex: number) => {
									return (
										<div
											key={checkbox.id}
											className={styles.inputEdit}
											style={{
												border: `2px solid ${palette.primary.main}`,
											}}>
											Checkbox
											<div className={styles.options}>
												<div className={styles.option}>
													<div
														style={{
															fontWeight: 'bold',
															marginTop: 'auto',
														}}>
														Order
													</div>
													<div>
														<Select
															value={
																forms[index]
																	.checkboxes[
																	checkboxIndex
																].order
															}
															size='small'
															onChange={(event) =>
																setForms(
																	(prev) => {
																		let updatedList =
																			prev;
																		updatedList[
																			index
																		].checkboxes[
																			checkboxIndex
																		].order =
																			event.target.value;
																		return [
																			...updatedList,
																		];
																	}
																)
															}>
															{Array.from(
																Array(
																	numberOfOptions
																).keys()
															).map(
																(
																	num: number,
																	index: number
																) => (
																	<MenuItem
																		key={
																			index
																		}
																		value={
																			num
																		}>
																		{num}
																	</MenuItem>
																)
															)}
														</Select>
													</div>
												</div>
												<div className={styles.option}>
													<span
														style={{
															fontWeight: 'bold',
															marginTop: 'auto',
														}}>
														Label
													</span>
													<span>
														<TextField
															size='small'
															value={
																forms[index]
																	.checkboxes[
																	checkboxIndex
																]?.label
															}
															onChange={(event) =>
																setForms(
																	(prev) => {
																		let updatedList =
																			prev;
																		updatedList[
																			index
																		].checkboxes[
																			checkboxIndex
																		].label =
																			event.target.value;
																		return [
																			...updatedList,
																		];
																	}
																)
															}
														/>
													</span>
												</div>
												<div className={styles.option}>
													<span
														style={{
															fontWeight: 'bold',
															marginTop: 'auto',
														}}>
														Required
													</span>
													<span>
														<Switch
															checked={
																forms[index]
																	.checkboxes[
																	checkboxIndex
																]?.required
															}
															onChange={() =>
																setForms(
																	(prev) => {
																		let updatedList =
																			prev;
																		updatedList[
																			index
																		].checkboxes[
																			checkboxIndex
																		].required =
																			!updatedList[
																				index
																			]
																				.checkboxes[
																				checkboxIndex
																			]
																				.required;
																		return [
																			...updatedList,
																		];
																	}
																)
															}
														/>
													</span>
												</div>
											</div>
										</div>
									);
								}
							)}
							<div className={styles.action}>
								<Button
									disabled={loading}
									variant='contained'
									onClick={() => updateForm(el.id, index)}>
									Save Changes
								</Button>
								<Button
									style={{
										borderRadius: '50%',
										height: '64px',
										width: '50px',
									}}
									disabled={loading}
									variant='contained'
									onClick={handleFormClick}>
									<AddIcon fontSize='large' />
								</Button>
								<Popover
									id={idForm}
									open={openForm}
									anchorEl={addToFormPopUp}
									onClose={handleFormClose}
									anchorOrigin={{
										vertical: -90,
										horizontal: 19,
									}}>
									<div style={{ height: '100px' }}>test</div>
								</Popover>
							</div>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
};

export default AdminForms;
