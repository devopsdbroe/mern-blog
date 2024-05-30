import AnimationWrapper from "../components/AnimationWrapper";
import InputBox from "../components/InputBox";

const ChangePassword = () => {
	return (
		<AnimationWrapper>
			<form>
				<h1 className="max-md:hidden">Change Password</h1>

				<div className="py-10 w-full md:max-w-[400px]">
					<InputBox
						name="currentPassword"
						type="password"
						className="profile-edit-input"
						placeholder="Current Password"
						icon="fi-rr-unlock"
					/>

					<InputBox
						name="newPassword"
						type="password"
						className="profile-edit-input"
						placeholder="New Password"
						icon="fi-rr-unlock"
					/>

					<button
						className="btn-dark px-10"
						type="submit"
					>
						Change Password
					</button>
				</div>
			</form>
		</AnimationWrapper>
	);
};
export default ChangePassword;
