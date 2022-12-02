import React, { SetStateAction } from 'react';
import { Paper } from '@mui/material';
import styles from '../styles/Edit.module.css';
import { TextField, Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSession } from 'next-auth/react';
import Loading from './Loading';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Option,
	Select,
	Form,
	Input,
	Select as SelectTS,
	CheckBox,
} from '@prisma/client';

const SelectOptions = ({
	select,
	setLoading,
	forms,
	loading,
	index,
	selectIndex,
	setForms,
	close,
}: {
	select: Select & { options: Option[] };
	setLoading: React.Dispatch<SetStateAction<boolean>>;
	forms: (Form & {
		inputs: Input[];
		selects: (SelectTS & { options: Option[] })[];
		checkboxes: CheckBox[];
	})[];
	loading: boolean;
	index: number;
	selectIndex: number;
	setForms: React.Dispatch<
		SetStateAction<
			(Form & {
				inputs: Input[];
				selects: (SelectTS & { options: Option[] })[];
				checkboxes: CheckBox[];
			})[]
		>
	>;
	close: () => void;
}) => {
	const { data: session } = useSession();
	return (
		<div style={{ position: 'fixed' }} className={styles.container}>
			<Paper
				style={{
					position: 'relative',
					height: 'fit-content',
					width: '90%',
					padding: '20px',
					paddingBottom: '40px',
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
				}}
				elevation={3}>
				<h1 style={{ textAlign: 'center' }}>Options:</h1>
				{session?.user?.admin ? (
					<>
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
														forms[index].selects[
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
															.then((response) =>
																response.json()
															)
															.then((data) => {
																options =
																	data[index]
																		.selects[
																		selectIndex
																	].options;
															});
														setLoading(false);
														setForms((prev) => {
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
														});
													}}>
													<DeleteIcon />
												</Button>
											</div>
										);
									}
								)
							)}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
								}}>
								<Button
									disabled={loading}
									variant='contained'
									style={{
										borderBottomRightRadius: '0px',
										borderTopRightRadius: '0px',
									}}
									onClick={async () => {
										setLoading(true);

										await fetch('/api/admin/updateoption', {
											method: 'POST',
											body: JSON.stringify({
												options: select.options,
											}),
										});

										await fetch('/api/admin/createoption', {
											method: 'POST',
											body: JSON.stringify({
												value: 'New Option',
												selectId: select.id,
											}),
										});
										let options =
											forms[index].selects[selectIndex]
												.options;
										await fetch('/api/admin/getforms')
											.then((response) => response.json())
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
									disabled={loading}
									variant='outlined'
									style={{
										borderBottomLeftRadius: '0px',
										borderTopLeftRadius: '0px',
									}}
									onClick={async () => {
										setLoading(true);
										await fetch('/api/admin/updateoption', {
											method: 'POST',
											body: JSON.stringify({
												options: select.options,
											}),
										});
										close();
										setLoading(false);
									}}>
									Close
								</Button>
							</div>
						</div>
					</>
				) : (
					<Loading />
				)}

				<CancelIcon
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						cursor: 'pointer',
					}}
					fontSize='large'
					onClick={close}
				/>
			</Paper>
		</div>
	);
};

export default SelectOptions;
