import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '../styles/AdminForms.module.css';
import SelectView from './SelectView';
import {
	Form,
	Select as SelectTS,
	CheckBox,
	Input,
	Option,
} from '@prisma/client';
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
	styled,
	MenuProps,
	alpha,
	Menu,
} from '@mui/material';

const FormView = ({
	forms,
	numberOfOptions,
	index,
	loading,
	setLoading,
	setForms,
	el,
}: {
	forms: (Form & {
		selects: (SelectTS & { options: Option[] })[];
		inputs: Input[];
		checkboxes: CheckBox[];
	})[];
	numberOfOptions: number;
	index: number;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setForms: React.Dispatch<
		React.SetStateAction<
			(Form & {
				inputs: Input[];
				selects: (SelectTS & { options: Option[] })[];
				checkboxes: CheckBox[];
			})[]
		>
	>;

	el: Form & {
		inputs: Input[];
		selects: (SelectTS & { options: Option[] })[];
		checkboxes: CheckBox[];
	};
}) => {
	const [addToFormPopUp, setAddToFormPopUp] =
		useState<HTMLButtonElement | null>(null);
	const { palette } = useTheme();

	const updateForm = async (loading?: boolean) => {
		if (loading) {
			setLoading(true);
			await fetch('/api/admin/updateform', {
				method: 'POST',
				body: JSON.stringify({ id: el.id, data: forms[index] }),
			});
			setLoading(false);
			return;
		}
		await fetch('/api/admin/updateform', {
			method: 'POST',
			body: JSON.stringify({ id: el.id, data: forms[index] }),
		});
	};

	const deleteFromForm = async (type: string, id: string) => {
		setLoading(true);
		await fetch('/api/admin/deletefromform', {
			method: 'POST',
			body: JSON.stringify({ type, id }),
		});
		await updateForm(false);
		await fetch('/api/admin/getforms')
			.then((response) => response.json())
			.then((data) => setForms(data));
		setLoading(false);
	};

	const createFormElement = async (type: string, formId: string) => {
		setLoading(true);
		handleFormClose();
		await updateForm(false);
		await fetch('/api/admin/createformelement', {
			method: 'POST',
			body: JSON.stringify({ formId, type }),
		});
		await fetch('/api/admin/getforms')
			.then((response) => response.json())
			.then((data) => setForms(data));

		setLoading(false);
	};

	const handleFormClick = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		setAddToFormPopUp(event.currentTarget);
	};
	const handleFormClose = () => {
		setAddToFormPopUp(null);
	};

	const openForm = Boolean(addToFormPopUp);
	const idForm = openForm ? 'popover-form' : undefined;

	const StyledMenu = styled((props: MenuProps) => (
		<Menu elevation={0} {...props} />
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 180,
			color:
				theme.palette.mode === 'light'
					? 'rgb(55, 65, 81)'
					: theme.palette.grey[300],
			boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 25,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(
						theme.palette.primary.main,
						theme.palette.action.selectedOpacity
					),
				},
			},
		},
	}));

	return (
		<Accordion
			key={index}
			className={styles.accordion}
			elevation={3}
			style={{
				border: `2px solid ${palette.primary.main}`,
				borderRadius: '10px',
				marginTop: '10px',
			}}>
			<AccordionSummary
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'cenetr',
					width: '100%',
					position: 'relative',
				}}
				expandIcon={<ExpandMoreIcon />}>
				<div
					style={{
						maxWidth: '80%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
					}}>
					<span>{el?.name}</span>
					<span
						style={{
							fontWeight: 'bold',
							paddingLeft: '5px',
						}}>
						{el.active ? (
							'(Active)'
						) : (
							<Button
								onClick={async (event) => {
									event.stopPropagation();
									setLoading(true);
									await fetch('/api/admin/activeform', {
										method: 'POST',
										body: el.id,
									});
									await fetch('/api/admin/getforms')
										.then((response) => response.json())
										.then((data) => setForms(data));
									setLoading(false);
								}}
								style={{
									padding: '0px',
									marginBottom: 'auto',
									minHeight: '26px',
									height: '26px',
									justifySelf: 'center',
									alignSelf: 'center',
									fontWeight: 'bold',
									fontSize: '1rem',
								}}>
								{'(Make active)'}
							</Button>
						)}
					</span>
					{el.id !== 'main' ? (
						<Button
							color='error'
							onClick={async (event) => {
								event.stopPropagation();
								setLoading(true);
								await fetch('/api/admin/removeform', {
									method: 'POST',
									body: el.id,
								});
								await fetch('/api/admin/getforms')
									.then((response) => response.json())
									.then((data) => setForms(data));
								setLoading(false);
							}}
							style={{
								padding: '1px',
								minWidth: 'fit-content',
								justifyContent: 'flex-start',
								position: 'absolute',
								right: '60px',
							}}>
							<DeleteForeverIcon fontSize='medium' />
						</Button>
					) : null}
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<>
					{el.inputs.map((input: Input, inputIndex: number) => {
						return (
							<div
								key={input.id}
								className={styles.inputEdit}
								style={{
									border: `2px solid ${palette.primary.main}`,
								}}>
								{el.inputs.length !== 1 ? (
									<div
										className={styles.delete}
										onClick={() => {
											deleteFromForm('input', input.id);
										}}>
										<DeleteForeverIcon color='error' />
									</div>
								) : null}
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
												defaultValue={inputIndex}
												value={
													forms[index].inputs[
														inputIndex
													].order
												}
												size='small'
												onChange={async (event) => {
													setForms((prev) => {
														let updatedList = prev;
														updatedList[
															index
														].inputs[
															inputIndex
														].order = parseInt(
															`${event.target.value}`,
															10
														);
														return [...updatedList];
													});
													await updateForm(true);
												}}>
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
														let updatedList = prev;
														updatedList[
															index
														].inputs[
															inputIndex
														].label =
															event.target.value;
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
														let updatedList = prev;
														updatedList[
															index
														].inputs[
															inputIndex
														].placeholder =
															event.target.value;
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
														let updatedList = prev;
														updatedList[
															index
														].inputs[
															inputIndex
														].required =
															!updatedList[index]
																.inputs[
																inputIndex
															].required;
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
														let updatedList = prev;
														updatedList[
															index
														].inputs[
															inputIndex
														].type =
															event.target.value;
														return [...updatedList];
													})
												}>
												{[
													'text',
													'email',
													'number',
													'password',
													'color',
												].map((el: string) => (
													<MenuItem
														key={el}
														value={el}>
														{el}
													</MenuItem>
												))}
											</Select>
										</span>
									</div>
								</div>
							</div>
						);
					})}
					{el.selects.map(
						(
							select: SelectTS & { options: Option[] },
							selectIndex: number
						) => {
							return (
								<SelectView
									key={select.id}
									select={select}
									selectIndex={selectIndex}
									deleteFromForm={deleteFromForm}
									forms={forms}
									setForms={setForms}
									index={index}
									numberOfOptions={numberOfOptions}
									loading={loading}
									setLoading={setLoading}
									updateForm={updateForm}
								/>
							);
						}
					)}
					{el.checkboxes.map(
						(checkbox: CheckBox, checkboxIndex: number) => {
							return (
								<div
									key={checkbox.id}
									className={styles.inputEdit}
									style={{
										border: `2px solid ${palette.primary.main}`,
									}}>
									<div
										className={styles.delete}
										onClick={() => {
											deleteFromForm(
												'checkbox',
												checkbox.id
											);
										}}>
										<DeleteForeverIcon color='error' />
									</div>
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
														forms[index].checkboxes[
															checkboxIndex
														].order
													}
													size='small'
													onChange={async (event) => {
														setForms((prev) => {
															let updatedList =
																prev;
															updatedList[
																index
															].checkboxes[
																checkboxIndex
															].order = parseInt(
																`${event.target.value}`,
																10
															);
															return [
																...updatedList,
															];
														});
														await updateForm(true);
													}}>
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
														forms[index].checkboxes[
															checkboxIndex
														]?.label
													}
													onChange={(event) =>
														setForms((prev) => {
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
														forms[index].checkboxes[
															checkboxIndex
														]?.required
													}
													onChange={() =>
														setForms((prev) => {
															let updatedList =
																prev;
															updatedList[
																index
															].checkboxes[
																checkboxIndex
															].required =
																!updatedList[
																	index
																].checkboxes[
																	checkboxIndex
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
								</div>
							);
						}
					)}
				</>

				<div className={styles.action}>
					<Button
						disabled={loading}
						variant='contained'
						onClick={() => updateForm(true)}>
						Save Changes
					</Button>
					<Button
						style={{
							borderRadius: '50%',
							minWidth: '40px',
							width: '50px',
							height: '50px',
							padding: '0 0',
						}}
						disabled={loading}
						variant='contained'
						onClick={handleFormClick}>
						<AddIcon fontSize='large' />
					</Button>
					<StyledMenu
						id={idForm}
						open={openForm}
						anchorEl={addToFormPopUp}
						onClose={handleFormClose}
						anchorOrigin={{
							vertical: -90,
							horizontal: 19,
						}}>
						<MenuItem
							onClick={() => createFormElement('input', el.id)}>
							<TextFieldsIcon fontSize='large' />
							Input
						</MenuItem>
						<MenuItem
							onClick={() => createFormElement('select', el.id)}>
							<PlaylistAddCheckIcon fontSize='large' />
							Select
						</MenuItem>
						<MenuItem
							onClick={() =>
								createFormElement('checkbox', el.id)
							}>
							<CheckBoxIcon fontSize='large' />
							CheckBox
						</MenuItem>
					</StyledMenu>
				</div>
			</AccordionDetails>
		</Accordion>
	);
};

export default FormView;
