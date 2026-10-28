import { useState, useEffect } from 'react';

import './dashboard.css';
import Navbar from '../navbar';

const Dashboard = () => {

    const [repositories, setRepositories] = useState([]);
	const [suggestedRepositories, setSuggestedRepositories] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	   useEffect(() => {

		const userId = localStorage.getItem('userId');

		const fetchRepositories = async () => {
			if (!userId) {
				setRepositories([]);
				return;
			}

			try {
				const response = await fetch(`http://localhost:3002/repo/user/${userId}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data?.message || "Failed to fetch repositories");
				}

				setRepositories(data.repositories || []);
				console.log("Fetched repositories:", data);
			} catch (error) {
				console.error(error.message);
			}
		};

		 const fetchSuggestedRepositories = async () => {
			if (!userId) {
				setSuggestedRepositories([]);
				return;
			}

			try {
				const response = await fetch(`http://localhost:3002/repo/all`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data?.message || "Failed to fetch repositories");
				}

				setSuggestedRepositories(data || []);
				console.log("Fetched suggested repositories:", data);
			} catch (error) {
				console.error(error.message);
			}
		};

		fetchRepositories();
		fetchSuggestedRepositories();
	   }, []);

    useEffect(()=>{
       if(searchQuery==''){
		setSearchResults(repositories);
	   }else{
		 const filteredRepo= repositories.filter((repo) =>repo.name.toLowerCase().includes(searchQuery.toLowerCase()));
		 setSearchResults(filteredRepo);
	   }
	},[searchQuery,repositories]);
	    
	   
	return (
		<>
		<Navbar />
		<section className="dashboard-page">
			<aside className="dashboard-panel dashboard-panel-left">
			<h1>Dashboard</h1>
		  	<input
		  		type="search"
		  		placeholder="Search repositories"
		  		value={searchQuery}
		  		onChange={(event) => setSearchQuery(event.target.value)}
		  	/>
		 	<h2>Suggested Repositories</h2>
		 	{suggestedRepositories.length === 0 ? (
		 		<p>No suggested repositories found.</p>
		 	) : (
		 		<ul>
		 			{suggestedRepositories.map((repository) => (
		 				<li key={repository._id}>{repository.name}</li>
		 			))}
		 		</ul>
		 	)}
		 	{repositories.length === 0 ? (
		 		<p>No repositories found.</p>
		 	) : (
		 		<ul>
		 			{searchResults.map((repository) => (
		 				<li key={repository._id}>{repository.name}</li>
		 			))}
		 		</ul>
		 	)}	
			</aside>
			<main className="dashboard-panel dashboard-panel-main">
				<div className="dashboard-card">
					<h2>Workspace Overview</h2>
					<p>{repositories.length} repositories in your workspace</p>
				</div>
				<div className="dashboard-card">
					<h2>Search Results</h2>
					{searchResults.length === 0 ? (
						<p>No repositories match your search.</p>
					) : (
						<ul>
							{searchResults.map((repository) => (
								<li key={repository._id}>{repository.name}</li>
							))}
						</ul>
					)}
				</div>
			</main>
			<aside className="dashboard-panel dashboard-panel-right">
				<h3>Upcoming Events</h3>
				<ul>
					<li><p>Tech conference - Dec 15 </p></li>
					<li><p>Developer Meetup- Dec 19 </p></li>
					<li><p>React Summit - Dec 5 </p></li>
				</ul>
			</aside>
		</section>

</>



		// <div>
		// 	<h1>Dashboard</h1>
		// 	<h2>Suggested Repositories</h2>
		// 	{suggestedRepositories.length === 0 ? (
		// 		<p>No suggested repositories found.</p>
		// 	) : (
		// 		<ul>
		// 			{suggestedRepositories.map((repository) => (
		// 				<li key={repository._id}>{repository.name}</li>
		// 			))}
		// 		</ul>
		// 	)}
		// 	{repositories.length === 0 ? (
		// 		<p>No repositories found.</p>
		// 	) : (
		// 		<ul>
		// 			{repositories.map((repository) => (
		// 				<li key={repository._id}>{repository.name}</li>
		// 			))}
		// 		</ul>
		// 	)}
		// </div>
	)

}

export default Dashboard;