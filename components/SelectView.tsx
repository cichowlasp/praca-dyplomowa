import React, { useState } from 'react';
import styles from '../styles/AdminForms.module.css';
import {
	Select,
	MenuItem,
	TextField,
	Switch,
	useTheme,
	Button,
	Popover,
	styled,
	MenuProps,
	Menu,
	alpha,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
	CheckBox,
	Form,
	Input,
	Option,
	Select as SelectTS,
} from '@prisma/client';

const SelectView = ({
	select,
	selectIndex,
	deleteFromForm,
	forms,
	setForms,
	index,
	numberOfOptions,
	loading,
	setLoading,
}: {
	select: SelectTS & { options: Option[] };
	selectIndex: number;
	deleteFromForm: (type: string, id: string) => {};
	forms: (Form & {
		inputs: Input[];
		selects: (SelectTS & { options: Option[] })[];
		checkboxes: CheckBox[];
	})[];
	setForms: React.Dispatch<
		React.SetStateAction<
			(Form & {
				inputs: Input[];
				selects: (SelectTS & { options: Option[] })[];
				checkboxes: CheckBox[];
			})[]
		>
	>;
	index: number;
	numberOfOptions: number;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { palette } = useTheme();
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<div
			key={select.id}
			className={styles.inputEdit}
			style={{
				border: `2px solid ${palette.primary.main}`,
			}}>
			<div
				className={styles.delete}
				onClick={() => {
					deleteFromForm('select', select.id);
				}}>
				<DeleteForeverIcon color='error' />
			</div>
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
							value={forms[index].selects[selectIndex].order}
							size='small'
							onChange={(event) =>
								setForms((prev) => {
									let updatedList = prev;
									updatedList[index].selects[
										selectIndex
									].order = parseInt(`${event.target.value}`);
									return [...updatedList];
								})
							}>
							{Array.from(Array(numberOfOptions).keys()).map(
								(num: number, index: number) => (
									<MenuItem key={index} value={num}>
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
							value={forms[index].selects[selectIndex]?.label}
							onChange={(event) =>
								setForms((prev) => {
									let updatedList = prev;
									updatedList[index].selects[
										selectIndex
									].label = event.target.value;
									return [...updatedList];
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
							Options
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
									flexDirection: 'column',
									justifyContent: 'center',
								}}>
								{select.options.length === 0 ? (
									<div
										style={{
											display: 'flex',
											padding: '10px',
											justifyContent: 'center',
											width: '15rem',
										}}>
										{'No options :('}
									</div>
								) : (
									select.options.map(
										(inp: Option, inpIndex: number) => {
											return (
												<div
													key={inp.id}
													style={{
														padding: '5px',
														display: 'flex',
														alignItems: 'center',
													}}>
													<TextField
														size='small'
														placeholder='option'
														value={
															forms[index]
																.selects[
																selectIndex
															]?.options[inpIndex]
																.value
														}
														onChange={(event) =>
															setForms((prev) => {
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
															})
														}
													/>
													<Button
														color='error'
														variant='contained'
														disabled={loading}
														style={{
															marginLeft: '5px',
														}}
														onClick={async () => {
															let options: Option[];
															setLoading(true);
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
																	(data) => {
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
															setLoading(false);
															setForms((prev) => {
																let updatedList =
																	prev;
																updatedList[
																	index
																].selects[
																	selectIndex
																].options = updatedList[
																	index
																].selects[
																	selectIndex
																].options = options;

																return [
																	...updatedList,
																];
															});
														}}>
														<DeleteIcon />
													</Button>
												</div>
											);
										}
									)
								)}
								<div style={{ display: 'flex' }}>
									<Button
										disabled={loading}
										fullWidth={true}
										variant='contained'
										style={{
											borderBottomRightRadius: '0px',
											borderTopRightRadius: '0px',
										}}
										onClick={async () => {
											setLoading(true);

											await fetch(
												'/api/admin/updateoption',
												{
													method: 'POST',
													body: JSON.stringify({
														options: select.options,
													}),
												}
											);

											await fetch(
												'/api/admin/createoption',
												{
													method: 'POST',
													body: JSON.stringify({
														value: 'New Option',
														selectId: select.id,
													}),
												}
											);
											let options =
												forms[index].selects[
													selectIndex
												].options;
											await fetch('/api/admin/getforms')
												.then((response) =>
													response.json()
												)
												.then((data) => {
													options.push(
														data[index].selects[
															selectIndex
														].options.at(-1)
													);
												});
											setLoading(false);

											setForms((prev) => {
												let updatedList = prev;
												updatedList[index].selects[
													selectIndex
												].options = options;

												return [...updatedList];
											});
										}}>
										Add Option
									</Button>

									<Button
										fullWidth={true}
										disabled={loading}
										variant='outlined'
										style={{
											borderBottomLeftRadius: '0px',
											borderTopLeftRadius: '0px',
										}}
										onClick={async () => {
											setLoading(true);
											await fetch(
												'/api/admin/updateoption',
												{
													method: 'POST',
													body: JSON.stringify({
														options: select.options,
													}),
												}
											);
											setLoading(false);
											handleClose();
										}}>
										Close
									</Button>
								</div>
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
								forms[index].selects[selectIndex]?.required
							}
							onChange={() =>
								setForms((prev) => {
									let updatedList = prev;
									updatedList[index].selects[
										selectIndex
									].required =
										!updatedList[index].selects[selectIndex]
											.required;
									return [...updatedList];
								})
							}
						/>
					</span>
				</div>
			</div>
		</div>
	);
};

export default SelectView;
