<script lang="ts">
    import UserGroup from '$shared/icons/UserGroup.svelte'
    import Heading from '$shared/components/Heading.svelte'
    import ButtonGroup from '$shared/components/ButtonGroup.svelte'
    import LinkButton from '$shared/components/LinkButton.svelte'
    import { STORIES_ABOUT_LINK } from '$lib/constants'
</script>

<div class="mt-16 flex flex-col items-center justify-between bg-white p-4 shadow-lg">
    <UserGroup />
    <Heading size={2} class="py-2 text-center">Stories by and for the community</Heading>

    <p class="px-4 pb-4 text-left">
        Stories help us learn together with the global IDG community and share inspiration and
        insights along the journey. Our vision is to bring people together, and create a vast
        library of stories exploring how to use the IDGs in practice to reach the SDGs.
    </p>

    <p class="px-4 pb-4 text-left">
        To make this happen, our small editorial team needs your help. This is a community-driven
        project where you can make a meaningful contribution to not just learn more about the IDGs
        yourself - but also empower many others.
    </p>

    <ButtonGroup breakpoint="sm">
        <LinkButton href={STORIES_ABOUT_LINK} variant="inverted" class="border border-transparent"
            >Share your story</LinkButton
        >
        <LinkButton href={STORIES_ABOUT_LINK} variant="secondary-inverted"
            >Join the editorial team</LinkButton
        >
    </ButtonGroup>
</div>
