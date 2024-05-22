import { Link } from "react-router-dom";
import { getFullDay } from "../utils/date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
	return (
		<div className={`md:w-[90%] md:mt-7 ${className}`}>
			<p className="text-xl leading-7">
				{bio.length ? bio : "Nothing to see here"}
			</p>

			<div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
				{Object.keys(social_links).map((key, i) => {
					const link = social_links[key];

					return link ? (
						<Link
							to={link}
							key={i}
							target="_blank"
						>
							<i
								className={`fi ${
									key !== "website" ? `fi-brands-${key}` : "fi-rr-globe"
								} text-2xl hover:text-black`}
							></i>
						</Link>
					) : (
						""
					);
				})}
			</div>

			<p className="text-xl leading-7 text-dark-grey">
				Joined on {getFullDay(joinedAt)}
			</p>
		</div>
	);
};
export default AboutUser;