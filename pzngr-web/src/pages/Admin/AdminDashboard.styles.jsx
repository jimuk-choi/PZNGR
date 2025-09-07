import styled from 'styled-components';

export const DashboardHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e5e5e5;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

export const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

export const ManagementSection = styled.div`
  margin-bottom: 3rem;
`;

export const ManagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const ManagementCard = styled.div`
  background-color: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const CardIcon = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
`;

export const CardDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const QuickActions = styled.div`
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
`;

export const QuickActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;