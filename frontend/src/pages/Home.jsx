import AnimationWrapper from "../components/AnimationWrapper";
import InPageNavigation from "../components/InPageNavigation";

const Home = () => {
	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* Latest blogs */}
				<div className="w-full">
					<InPageNavigation
						routes={["home", "trending blogs"]}
						defaultHidden={["trending blogs"]}
					>
						<h1>Latest Blogs</h1>

						<h1>Trending Blogs</h1>
					</InPageNavigation>
				</div>

				{/* Filters and trending */}
				<div></div>
			</section>
		</AnimationWrapper>
	);
};
export default Home;
