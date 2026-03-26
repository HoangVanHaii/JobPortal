import pool from '../config/database'; 
export const getSkillsByJobId = async (jobId: number) => {
    const query = `
        SELECT s.SkillID, s.SkillName 
        FROM JobSkills js
        JOIN Skills s ON js.SkillID = s.SkillID
        WHERE js.JobID = ?
    `;
    const [rows]: any = await pool.query(query, [jobId]);
    return rows;
};

export const syncJobSkills = async (jobId: number, skillIds: number[]) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(`DELETE FROM JobSkills WHERE JobID = ?`, [jobId]);
        if (skillIds && skillIds.length > 0) {
            const values = skillIds.map(skillId => [jobId, skillId]);
            await connection.query(`INSERT INTO JobSkills (JobID, SkillID) VALUES ?`, [values]);
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const removeSkillFromJob = async (jobId: number, skillId: number) => {
    const query = `DELETE FROM JobSkills WHERE JobID = ? AND SkillID = ?`;
    await pool.query(query, [jobId, skillId]);
};