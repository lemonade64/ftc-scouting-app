import { useEffect, useState } from "react";

export function useTeamData() {
  const [teamData, setTeamData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [currentTeamData, setCurrentTeamData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        const storedData = localStorage.getItem("formSubmissions");
        if (storedData) {
          const data = JSON.parse(storedData);
          setTeamData(data);
          if (data.length > 0) {
            setSelectedTeam(data[0].teamNumber.toString());
          }
        } else {
          console.log("No Data Found");
          setTeamData([]);
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
        setTeamData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const selected = teamData.filter(
      (team) => team.teamNumber.toString() === selectedTeam
    );
    setCurrentTeamData(selected);
  }, [selectedTeam, teamData]);

  function handleTeamChange(teamId) {
    setSelectedTeam(teamId);
  }

  return {
    teamData,
    selectedTeam,
    currentTeamData,
    handleTeamChange,
    isLoading,
  };
}
