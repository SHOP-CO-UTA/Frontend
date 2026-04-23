export default async function BlogPost({
    params,
}: {
    params: Promise<{ blogID: string }>;
}) {
    const { blogID } = await params;
    return (
        <div>
            <h1>Blog Post {blogID}</h1>
            <p>This is a blog post.</p>
        </div>
    );
}