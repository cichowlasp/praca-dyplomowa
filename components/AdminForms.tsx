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

const AdminForms = () => {
	const { palette } = useTheme();
	const { data: session } = useSession();
	const [forms, setForms] = useState<any[]>([]);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
		null
	);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getforms')
				.then((response) => response.json())
				.then((data) => setForms(data));
		}
	}, [session?.user.admin]);

	return (
		<div>
			{forms.map((el, index) => {
				const numberOfOptions =
					el.inputs.length + el.selects.length + el.checkboxes.length;
				return (
					<Accordion key={index}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							{el?.id}
						</AccordionSummary>
						<AccordionDetails>
							{el.inputs.map((input: any, inputIndex: number) => {
								return (
									<div
										key={inputIndex}
										className={styles.inputEdit}
										style={{
											border: `2px solid ${palette.primary.main}`,
										}}>
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
																key={index}
																value={el}>
																{el}
															</MenuItem>
														)
													)}
												</Select>
											</span>
										</div>
									</div>
								);
							})}
							{el.selects.map(
								(select: any, selectIndex: number) => {
									return (
										<div
											key={selectIndex}
											className={styles.inputEdit}
											style={{
												border: `2px solid ${palette.primary.main}`,
											}}>
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
																selectIndex
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
																	selectIndex
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
															forms[index]
																.selects[
																selectIndex
															]?.label
														}
														onChange={(event) =>
															setForms((prev) => {
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
													Options
												</span>
												<span>
													<Button
														aria-describedby={id}
														variant='contained'
														onClick={handleClick}>
														Open Popover
													</Button>
													<Popover
														id={id}
														open={open}
														anchorEl={anchorEl}
														onClose={handleClose}
														anchorOrigin={{
															vertical: 'bottom',
															horizontal: 'left',
														}}>
														<div
															style={{
																display: 'flex',
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
																				onClick={() =>
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
																								].options.filter(
																									(
																										rm: any
																									) =>
																										inp.value !=
																										rm.value
																								);

																							return [
																								...updatedList,
																							];
																						}
																					)
																				}>
																				<DeleteIcon />
																			</Button>
																		</div>
																	);
																}
															)}
															<Button
																variant='contained'
																onClick={() =>
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
																			].options.push(
																				{
																					selectId:
																						select.id,
																					value: '',
																				}
																			);

																			return [
																				...updatedList,
																			];
																		}
																	)
																}>
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
															setForms((prev) => {
																let updatedList =
																	prev;
																updatedList[
																	index
																].selects[
																	selectIndex
																].required =
																	!updatedList[
																		index
																	].selects[
																		selectIndex
																	].required;
																return [
																	...updatedList,
																];
															})
														}
													/>
												</span>
											</div>
										</div>
									);
								}
							)}
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
};

export default AdminForms;
